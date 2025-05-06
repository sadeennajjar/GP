import sqlite3

# Initialize the SQLite database
def initialize_db():
    conn = sqlite3.connect('kitchance_transcripts.db')  # Create or open the database
    cursor = conn.cursor()

    # Create the table if it doesn't exist
    cursor.execute('''
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
    conn.commit()  # Commit changes
    conn.close()  # Close the database connection

# Function to save the transcript into the database
def save_transcript(user_name, kitchen_style, materials, usage, layout, appliances, transcript):
    try:
        conn = sqlite3.connect('kitchance_transcripts.db')  # Open database
        cursor = conn.cursor()

        # Insert the transcript data into the table
        cursor.execute('''
            INSERT INTO transcripts (user_name, kitchen_style, materials, usage, layout, appliances, transcript)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (user_name, kitchen_style, materials, usage, layout, appliances, transcript))

        conn.commit()  # Commit the changes to the database
        return True
    except sqlite3.Error as e:
        print(f"Database error: {e}")
        return False
    finally:
        if conn:
            conn.close()  # Close the connection
