import sqlite3

conn = sqlite3.connect("kitchance_transcripts.db")
cursor = conn.cursor()

cursor.execute("SELECT id, email FROM users")
rows = cursor.fetchall()

print("📋 Registered Users:")
for row in rows:
    print(f"ID: {row[0]} | Email: {row[1]}")

conn.close()
