from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import pandas as pd
import requests
from surprise import SVD

app = Flask(__name__)
CORS(app)

# ─── LOAD MODELS & METADATA ────────────────────────────────────────────
indices      = pickle.load(open('model/indices.pkl', 'rb'))
id_map       = pickle.load(open('model/id_map.pkl', 'rb'))
cosine_sim   = pickle.load(open('model/cosine_sim.pkl', 'rb'))
algo         = pickle.load(open('model/algo.pkl', 'rb'))
smd          = pickle.load(open('model/smd.pkl', 'rb'))
indices_map  = pickle.load(open('model/indices_map.pkl', 'rb'))
gen_md       = pickle.load(open('model/gen_md.pkl', 'rb'))

# Fix for id_map if keys are titles and values are movieIds, invert it safely
if isinstance(next(iter(id_map.keys())), str):
    new_id_map = {}
    for k, v in id_map.items():
        if isinstance(v, pd.Series):
            key = v.iloc[0]  # extract scalar from Series
        else:
            key = v
        new_id_map[key] = k
    id_map = new_id_map
    print("Inverted id_map to map movieId to title (cleaned values)")

# ─── CACHES ─────────────────────────────────────────────────────────────
genre_cache    = {}
actor_cache    = {}
director_cache = {}

# ─── IN-MEMORY REVIEWS DB ───────────────────────────────────────────────
reviews_db = {}  # { movie_id: [ {id, rating, text}, ... ] }

# ─── HELPERS ────────────────────────────────────────────────────────────
def fetch_poster(movie_id):
    try:
        url  = f"https://api.themoviedb.org/3/movie/{movie_id}?api_key=8265bd1679663a7ea12ac168da84d2e8&language=en-US"
        data = requests.get(url).json()
        path = data.get('poster_path')
        return f"https://image.tmdb.org/t/p/w500/{path}" if path else None
    except Exception as e:
        print(f"Error fetching poster: {e}")
        return None

def hybrid(userId, title):
    idx = indices.get(title)
    if idx is None:
        return pd.DataFrame(columns=['title','movieId'])
    sims = sorted(
        enumerate(cosine_sim[int(idx)]),
        key=lambda x: x[1],
        reverse=True
    )[1:26]
    idxs = [i for i,_ in sims]
    df = smd.iloc[idxs][['title','vote_count','vote_average','release_date','movieId']].copy()
    df['est'] = df['movieId'].apply(
        lambda m: algo.predict(userId, indices_map.get(m, 'id')).est
    )
    return df.sort_values('est', ascending=False).head(10)

def build_chart(genre, percentile=0.85, save_path=None):
    df = gen_md[gen_md['genre'] == genre]
    votes = df['vote_count'].dropna().astype(int)
    avgs  = df['vote_average'].dropna().astype(int)
    C = avgs.mean()
    m = votes.quantile(percentile)

    q = df[
        (df['vote_count'] >= m) & df['vote_average'].notnull()
    ][['title','year','vote_count','vote_average','popularity','id']].copy()

    q['vote_count']   = q['vote_count'].astype(int)
    q['vote_average'] = q['vote_average'].astype(int)
    q['wr'] = q.apply(
        lambda x: (x.vote_count / (x.vote_count + m)) * x.vote_average +
                  (m / (m + x.vote_count)) * C,
        axis=1
    )

    top250 = q.sort_values('wr', ascending=False).head(250)
    if save_path:
        top250.to_pickle(save_path)
    return top250

# ─── ROUTES ─────────────────────────────────────────────────────────────

@app.route('/')
def home():
    return "🎬 FlickPick API is running"

@app.route('/api/recommend', methods=['POST'])
def recommend():
    try:
        data = request.get_json()
        userId = int(data['userId'])
        movie = data['movie']
        recs = hybrid(userId, movie)

        out = [{
            'title': r['title'],
            'movieId': r['movieId'],
            'poster': fetch_poster(r['movieId'])
        } for _, r in recs.iterrows()]
        return jsonify({'recommendations': out})
    except Exception as e:
        return jsonify(error=str(e)), 500

@app.route('/api/top_by_genre', methods=['POST'])
def api_top_by_genre():
    data = request.get_json() or {}
    genre = data.get('genre', '').strip().title()
    if not genre:
        return jsonify(error='Provide "genre"'), 400

    cache_path = f"model/genre_{genre}.pkl"
    if genre not in genre_cache:
        try:
            df = pd.read_pickle(cache_path)
            if df.empty: raise FileNotFoundError
        except:
            df = build_chart(genre, save_path=cache_path)
        genre_cache[genre] = df

    top10 = genre_cache[genre].head(10)
    out = [{
        'title': r['title'],
        'poster': fetch_poster(r['id'])
    } for _, r in top10.iterrows()]
    return jsonify(genre=genre, top_movies=out), 200

@app.route('/api/top_by_actor', methods=['POST'])
def api_top_by_actor():
    data = request.get_json() or {}
    name = data.get('actor', '').strip()
    if not name:
        return jsonify(error='Provide "actor"'), 400

    norm = name.replace(' ', '').lower()
    cache_path = f"model/actor_{norm}.pkl"

    if norm not in actor_cache:
        try:
            df = pd.read_pickle(cache_path)
            if df.empty: raise FileNotFoundError
        except:
            df = smd[smd['cast'].apply(lambda cast: any(
                norm == actor.replace(' ', '').lower() for actor in cast
            ))]
            if df.empty:
                return jsonify(error=f"No movies found for {name}"), 404
            df = df.sort_values('vote_count', ascending=False).head(10)
            df.to_pickle(cache_path)
        actor_cache[norm] = df

    df = actor_cache[norm]
    out = [{
        'title': r['title'],
        'movieId': int(r['movieId']),
        'poster': fetch_poster(r['movieId'])
    } for _, r in df.iterrows()]
    return jsonify(actor=name, top_movies=out), 200

@app.route('/api/top_by_director', methods=['POST'])
def api_top_by_director():
    data = request.get_json() or {}
    name = data.get('director', '').strip()
    if not name:
        return jsonify(error='Provide "director"'), 400

    norm = name.replace(' ', '').lower()
    cache_path = f"model/director_{norm}.pkl"

    if norm not in director_cache:
        try:
            df = pd.read_pickle(cache_path)
            if df.empty: raise FileNotFoundError
        except:
            df = smd[smd['crew'].apply(lambda crew: any(
                norm in member.replace(' ', '').lower()
                for sublist in crew for member in (sublist if isinstance(sublist, list) else [sublist])
            ))]
            if df.empty:
                return jsonify(error=f"No movies found for {name}"), 404
            df = df.sort_values('vote_count', ascending=False).head(10)
            df.to_pickle(cache_path)
        director_cache[norm] = df

    df = director_cache[norm]
    out = [{
        'title': r['title'],
        'movieId': int(r['movieId']),
        'poster': fetch_poster(r['movieId'])
    } for _, r in df.iterrows()]
    return jsonify(director=name, top_movies=out), 200

@app.route('/api/trending', methods=['GET'])
def api_trending():
    try:
        top10 = smd.sort_values('popularity', ascending=False).head(10)
        out = [{
            'title': r['title'],
            'movieId': int(r['movieId']),
            'poster': fetch_poster(r['movieId'])
        } for _, r in top10.iterrows()]
        return jsonify(top_movies=out), 200
    except Exception as e:
        return jsonify(error=str(e)), 500

# ─── USER REVIEWS & RATINGS ─────────────────────────────────────────────
@app.route('/api/reviews/<int:movie_id>', methods=['GET', 'POST'])
def reviews(movie_id):
    if request.method == 'GET':
        return jsonify(reviews_db.get(movie_id, []))

    if request.method == 'POST':
        data = request.get_json()
        rating = data.get('rating')
        text = data.get('text', '').strip()

        if not isinstance(rating, int) or not (1 <= rating <= 5):
            return jsonify(error="Rating must be an integer between 1 and 5"), 400

        new_review = {
            "id": len(reviews_db.get(movie_id, [])) + 1,
            "rating": rating,
            "text": text
        }

        reviews_db.setdefault(movie_id, []).append(new_review)
        return jsonify(success=True, review=new_review)

# ─── SIMILAR MOVIES ENDPOINT ─────────────────────────────────────────────
@app.route('/api/similar/<int:movie_id>', methods=['GET'])
def similar_movies(movie_id):
    # Try lookup in id_map first
    movie_title = id_map.get(movie_id)
    
    # Fallback: try to get title from smd DataFrame
    if movie_title is None:
        row = smd[smd['movieId'] == movie_id]
        if not row.empty:
            movie_title = row.iloc[0]['title']
    
    print(f"Looking for similar movies to ID {movie_id}, title: {movie_title}")
    if not movie_title:
        return jsonify(error="Movie ID not found in id_map or smd"), 404

    idx = indices.get(movie_title)
    print(f"Index in similarity matrix: {idx}")
    if idx is None:
        return jsonify(error="Movie title not found in indices"), 404

    sims = sorted(
        enumerate(cosine_sim[int(idx)]),
        key=lambda x: x[1],
        reverse=True
    )[1:11]

    print(f"Similarities found: {sims}")

    if not sims:
        return jsonify(similar_movies=[]), 200

    idxs = [i for i, _ in sims]
    df = smd.iloc[idxs][['title', 'movieId']]
    out = [{
        'title': row['title'],
        'movieId': row['movieId'],
        'poster': fetch_poster(row['movieId'])
    } for _, row in df.iterrows()]

    print(f"Similar movies returned: {[m['title'] for m in out]}")
    return jsonify(similar_movies=out), 200



# ─── RUN SERVER ─────────────────────────────────────────────────────────
if __name__ == '__main__':
    app.run(debug=True)
