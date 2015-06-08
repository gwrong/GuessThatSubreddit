var fs = require('fs');
var path = require('path');
var filename = 'top100subreddits.txt'
var fileLoc = path.join(__dirname, filename);

function getRandomSubreddits(notThisSubreddit, callback){
   var randomSubreddits = [notThisSubreddit];
   //console.log(fileLoc);
   fs.readFile(fileLoc, function(err, data){
      if(err) throw err;
      var lines = data.toString().split('\n');
      for (i = 0; i < 3; i++) {
         randomSubreddit = lines[Math.floor(Math.random()*lines.length)];
         while (contains(randomSubreddits, randomSubreddit)) {
            randomSubreddit = lines[Math.floor(Math.random()*lines.length)];
         }
         randomSubreddits.push(randomSubreddit);
      }
   return callback(null, randomSubreddits);
   })
}

/**
 * Randomize array element order in-place.
 * Using Fisher-Yates shuffle algorithm.
 */
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

function contains(a, obj) {
    var i = a.length;
    while (i--) {
       if (a[i] === obj) {
           return true;
       }
    }
    return false;
}

module.exports.getRandomSubreddits = getRandomSubreddits;
module.exports.shuffleArray = shuffleArray;
