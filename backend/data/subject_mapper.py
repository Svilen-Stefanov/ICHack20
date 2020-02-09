import json
from random import randrange, choice
import csv


f = open('topic_id', 'r')
topic_ids = f.readlines();
topic_ids = [t.strip('\n') for t in topic_ids]
f = open('user_id', 'r')
user_ids = f.readlines();
user_ids = [u.strip('\n') for u in user_ids]
f = open('topic_mapping.csv', 'w')
csv_file = csv.writer(f)

for user_id in user_ids:
    choices = set()
    for i in range(randrange(5) + 1):
        topic = choice(topic_ids)
        if topic in choices:
            continue
        choices.add(topic)
        csv_file.writerow([None, user_id, topic, randrange(10) + 1])

