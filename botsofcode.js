/* ******************

 Fixes for Heroku
 See http://stackoverflow.com/a/31094668

 ******************* */

const express = require('express');
const app = express();
const path = require('path');
app.set('port', (process.env.PORT || 7673));
app.get('/botsofcode', function (request, response) {
    response.sendFile(path.join(__dirname + '/views/index.html'));
}).listen(app.get('port'), function () {
    console.log('App is running, server is listening on port ', app.get('port'));
});


/* ******************

 The Setup

 ******************* */
const T = require('./modules/T');
const Twitter = require('./modules/twitter');

/* ******************

 Key Variables

 ******************* */
const me = {
    id: 1532703702,
    screen_name: 'MLadapo'
};

const botsofcode = {
    id: 921509836826791936,
    screen_name: 'PurdueSucks_'
};

const emojis = ['👊', '👊', '🙌', '👍', '💁', '👌', '🙅', '👯'];


/* ******************

 General Functions

 ******************* */
function shouldSendReply() {
    return false;
}

function getEmoji() {
    return emojis[Math.floor(Math.random() * emojis.length)];
}

function getTweet(tweet) {

    const text = `Thanks for sharing! ${ getEmoji() }`;
    return text;

}


/* ******************

 Stream

 ******************* */

const stream = T.stream('statuses/filter', { track: ['Purdue sucks', '4E42F7DD43EC'] });

stream.on('tweet', (tweet) => {

	if ( tweet.user.id === botsofcode.id ) {
		return;
	}

	if ( tweet.retweeted_status ) return;

	Twitter.like(tweet);

	Twitter.retweet(tweet);

	if ( shouldSendReply() ) {
		Twitter.reply(tweet, getTweet(tweet));
	}
});



