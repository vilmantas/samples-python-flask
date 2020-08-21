import requests, config
import sqlite3

database = sqlite3.connect('worker.sql')

cur = database.cursor();

r = requests.get(repo_query, auth=(config.username, config.password))

data = r.json()

repository_slugs = [x['slug'] for x in data['values']]

for i in data['values']:
    cur.execute('SELECT Id FROM Repositories WHERE Name = ?', (i['name'],))

    if cur.rowcount == -1:
        cur.execute('''INSERT INTO Repositories (Name, Slug) 
            VALUES ( ?, ? )''', ( i['name'], i['slug'] ) )

    database.commit()

# for i in repository_slugs[-1:]:
#     r = requests.get(commit_query % i, auth=(config.username, config.password))
#     print(r.json())