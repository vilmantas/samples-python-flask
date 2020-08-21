import sqlite3, requests, config

database = sqlite3.connect('worker.sql')

cursor = database.cursor()

repositores = cursor.execute('SELECT Id, Slug FROM Repositories').fetchall()


for repo in repositores[-1:]:
    r = requests.get(config.commit_query % repo[1], auth=(config.username, config.password))

    data = r.json()['values']

    for i in data:
        print(i['date'])
    