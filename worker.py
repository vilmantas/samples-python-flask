import requests, config

workspace = 'rystadenergy'

repo_query = f'https://api.bitbucket.org/2.0/repositories/{workspace}?pagelen=100&fields=values.name,values.slug'

commit_query = f'https://api.bitbucket.org/2.0/repositories/{workspace}/%s/commits?pagelen=80&fields=values.date,values.author.user.display_name,values.author.user.links.avatar.href&pagelen=10'

r = requests.get(repo_query, auth=(config.username, config.password))

data = r.json()

repository_slugs = [x['slug'] for x in data['values']]

print('\n'.join([x['name'] for x in data['values']]))

for i in repository_slugs[-1:]:
    r = requests.get(commit_query % i, auth=(config.username, config.password))
    print(r.json())