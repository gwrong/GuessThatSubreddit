#!/usr/bin/env python2
"""
Reddit example
===============
Generating a square wordcloud
"""

import MySQLdb
from os import path
import matplotlib.pyplot as plt
from wordcloud import WordCloud

comments_output = open('comments_output.txt', 'w')

d = path.dirname(__file__)

db = MySQLdb.connect("localhost", "reddit", "redditpassword", "reddit", use_unicode=True, charset='UTF8')
curs = db.cursor()

curs.execute("SELECT body from fitness_comments;")

rows = curs.fetchall()

for row in rows:
    comments_output.write(row[0].encode('utf-8'))

# Read the whole text.
text = open(path.join(d, 'comments_output.txt')).read()
wordcloud = WordCloud().generate(text)
wordcloud.to_file(path.join(d, "test.png"))
# Open a plot of the generated image.
plt.imshow(wordcloud)
plt.axis("off")
plt.show()
