import requests

response = requests.get('https://data.brisbane.qld.gov.au/api/explore/v2.1/catalog/datasets/flood-awareness-flood-risk-overall/records?limit=20')
data = response.json()

for result in data['results']:
    for key in result.keys():
        print(key, " = ", result[key])
        print()
        print()
