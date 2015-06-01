'''
Created on Feb 23, 2015

@author: Graham
'''

import MySQLdb
import praw
import time

db = MySQLdb.connect("localhost", "reddit", "redditpassword", "test")
curs = db.cursor()

r = praw.Reddit(user_agent='u\MoldyBrick Testing 1.0')
r.login('MoldyBrick', 'my_password')
file = open("Comment Test.txt", "w")
for x in range(0, 10):
    all_comments = r.get_comments('Fitness')
    for comment in all_comments:
	curs.execute("INSERT INTO test values(%s)", (comment.body))
        file.write(comment.body + "\n") 
    time.sleep(90)
db.commit()
file.close()
