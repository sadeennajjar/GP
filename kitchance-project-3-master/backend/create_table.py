import sqlite3

def create_table():
    conn = sqlite3.connect('kitchance_transcripts.db')  # Connect to the SQLite database
    cursor = conn.cursor()

    # Create the table if it doesn't exist
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS transcripts (
        id INTEGER PRIMARY KEY,
        user_name TEXT,
        kitchen_style TEXT,
        materials TEXT,
        usage TEXT,
        layout TEXT,
        appliances TEXT,
        transcript TEXT
    )
    ''')

    conn.commit()  # Save the changes
    conn.close()   # Close the connection

# Call the function to create the table
create_table()
