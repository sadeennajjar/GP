import sqlite3
import bcrypt

def initialize_db():
    # Connect or create the database file
    conn = sqlite3.connect("kitchance_transcripts.db")
    c = conn.cursor()

    # Create users table
    c.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    ''')

    # Create transcripts table
    c.execute('''
        CREATE TABLE IF NOT EXISTS transcripts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_name TEXT,
            kitchen_style TEXT,
            materials TEXT,
            usage TEXT,
            layout TEXT,
            appliances TEXT,
            transcript TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # Optional test user
    email = "test@example.com"
    password = "1234".encode('utf-8')
    hashed_pw = bcrypt.hashpw(password, bcrypt.gensalt())
    c.execute("INSERT OR IGNORE INTO users (email, password) VALUES (?, ?)", (email, hashed_pw))

    conn.commit()
    conn.close()
    print("✅ SQLite DB initialized with `users` table and optional test user.")

# 👇 Add this so it runs when you call: python init_db.py
if __name__ == '__main__':
    initialize_db()
