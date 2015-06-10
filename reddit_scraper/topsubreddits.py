from bs4 import BeautifulSoup
import re
import time
import urllib2

url = 'http://redditmetrics.com/top'
content = urllib2.urlopen(url).read()
soup = BeautifulSoup(content)
result = soup.select('tr td[class=tod]')
num = 0
final = []
pairs = []
for a in result:
    if (num % 3 == 1 or num % 3 == 2):
        final.append(a.getText().replace('/r/', ''))
    num = num + 1
x = 0
while (x < len(final) - 1):
    pairs.append((final[x], final[x+1]))
    x = x + 2
    
out = open('top100subreddits' + time.strftime("%Y%m%d-%H%M%S") + '.txt', 'w')
    
for x in range(len(pairs)):
    if ((x + 1) == len(pairs)):
        out.write(pairs[x][0])
    else:
        out.write(pairs[x][0] + '\n')
out.close()
