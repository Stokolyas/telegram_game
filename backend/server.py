from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

DATABASE = 'game.db'

def init_db():
    with sqlite3.connect(DATABASE) as conn:
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                telegramId TEXT PRIMARY KEY,
                score INTEGER DEFAULT 0,
                level INTEGER DEFAULT 1,
                clicks INTEGER DEFAULT 10,
                pointsPerClick INTEGER DEFAULT 1
            )
        ''')
        conn.commit()

@app.route('/save', methods=['POST'])
def save_game():
    data = request.json
    telegramId = data['telegramId']
    score = data['score']
    level = data['level']
    clicks = data['clicks']
    pointsPerClick = data['pointsPerClick']

    with sqlite3.connect(DATABASE) as conn:
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO users (telegramId, score, level, clicks, pointsPerClick)
            VALUES (?, ?, ?, ?, ?)
            ON CONFLICT(telegramId) DO UPDATE SET
                score=excluded.score,
                level=excluded.level,
                clicks=excluded.clicks,
                pointsPerClick=excluded.pointsPerClick
        ''', (telegramId, score, level, clicks, pointsPerClick))
        conn.commit()
    
    return jsonify({"message": "Game saved successfully"}), 200

@app.route('/load/<telegramId>', methods=['GET'])
def load_game(telegramId):
    with sqlite3.connect(DATABASE) as conn:
        cursor = conn.cursor()
        cursor.execute('''
            SELECT score, level, clicks, pointsPerClick FROM users WHERE telegramId = ?
        ''', (telegramId,))
        user = cursor.fetchone()

    if user:
        return jsonify({
            "score": user[0],
            "level": user[1],
            "clicks": user[2],
            "pointsPerClick": user[3]
        }), 200
    else:
        return jsonify({"error": "User not found"}), 404

if __name__ == '__main__':
    init_db()
    app.run(debug=True)