'''
Created on Feb 23, 2015

@author: Graham
'''

import MySQLdb
import praw
import time

db = MySQLdb.connect("localhost", "reddit", "redditpassword", "reddit", use_unicode=True, charset='UTF8')
curs = db.cursor()

curs.execute("SELECT MAX(created) from fitness_comments;")
mostRecent = curs.fetchone()[0]

max = 0

r = praw.Reddit(user_agent='u\MoldyBrick Testing 1.0')
r.login('MoldyBrick', 'my_password')
for x in range(0,1):
    all_comments = r.get_comments('Fitness')
    for comment in all_comments:
	created = comment.created
	if (created > mostRecent):
		curs.execute("INSERT INTO fitness_comments values(%s, %s, %s, %s)", (comment.body, comment.created, comment.id, comment.subreddit_id))
	if (created > max):
	    max = created
    mostRecent = max
    print mostRecent
    db.commit()
    time.sleep(90)
