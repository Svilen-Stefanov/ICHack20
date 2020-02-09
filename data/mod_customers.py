import json
from random import randrange, choice
import csv

institutions = [
"Cambridge",
"Oxford",
"St Andrews",
"Durham",
"Bath",
"Imperial College",
"Loughborough",
"Warwick",
"Lancaster",
"Surrey",
"UCL",
"Coventry",
"Exeter",
"Leeds",
"London School of Economics",
"Birmingham",
"York",
"UEA",
"Nottingham",
"Sussex"
]


with open('users.json', 'r') as f:
    customers = json.load(f)
f = open('user_data.csv', 'w')
csv_file = csv.writer(f)
for customer in customers:
    id_ = customer['id']
    first = customer['first_name']
    last = customer['last_name']
    date_of_birth = f'{randrange(50) + 1950}-{randrange(12) + 1}-{randrange(25) + 1} 00:00:00-00'
    institution = choice(institutions)
    description = ""
    profile_pic = ""
    csv_file.writerow([id_, first, last, date_of_birth, institution, description, profile_pic])



