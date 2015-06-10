#!/usr/bin/env python3

'''
Created on Feb 23, 2015

@author: Graham
'''

import MySQLdb
import praw
import time
import random

db = MySQLdb.connect("localhost", "root","masked_password2", "reddit", use_unicode=True, charset='UTF8')
curs = db.cursor()

for x in range(0, 50):
    max = 0

    randomSubreddit = random.choice(list(open('top100subreddits.txt'))).rstrip()
    print(randomSubreddit)

    curs.execute("SELECT MAX(created) from comments where subreddit='" + randomSubreddit + "';")
    mostRecent = curs.fetchone()[0]
    if (mostRecent is None):
        mostRecent = -1

    r = praw.Reddit(user_agent='u\MoldyBrick Testing 1.0')
    r.login('MoldyBrick', 'masked_password3')
    for x in range(0,1):
        all_comments = r.get_subreddit(randomSubreddit).get_comments()
        for comment in all_comments:
            print(comment.subreddit)
            created = comment.created
            if (created > mostRecent):
                curs.execute("INSERT INTO comments values(%s, %s, %s, %s)", (comment.id, comment.subreddit, comment.created, comment.body))
            if (created > max):
                max = created
        mostRecent = max
        print(mostRecent)
        db.commit()
