/* ******************

	The Setup

******************* */
const Twit = require('twit');
const T = new Twit({
	consumer_key: process.env.consumer_key,
	consumer_secret: process.env.consumer_secret,
	access_token: process.env.access_token,
	access_token_secret: process.env.access_token_secret
});


/* ******************

	Key Variables

******************* */
const me = {
	id: 2714960622,
	screen_name: 'ireaderinokun'
};

const botsofcode = {
	id: 743145993844179000,
	screen_name: 'botsofcode'
};

const emojis = ['👊', '👊', '🙌', '👍', '💁', '👌', '🙅', '👯'];


/* ******************

	Tweet Functions

******************* */
const tweet = (tweet) => {
	T.post('statuses/update', {
		status: tweet
	});
}

const retweet = (tweet) => {
	T.post('statuses/retweet/:id', { id: tweet.id_str });
};

const reply = (tweet, reply) => {
	T.post('statuses/update', {
		status: `@${tweet.user.screen_name} ${reply}`,
		in_reply_to_status_id: tweet.id_str
	});
}

const like = (tweet) => {
	T.post('favorites/create', { id: tweet.id_str });
}





/* ******************

	Stream

******************* */

const stream = T.stream('statuses/filter', { track: ['bitsofco.de', 'bitsofcode'] });

stream.on('tweet', (tweet) => {

	if ( tweet.user.id === me.id ) {
		retweet(tweet);
		return;
	}

	if ( tweet.text.includes('via @ireaderinokun') ) {
		like(tweet);
		reply(tweet, `Thanks for sharing! ${emojis[Math.floor(Math.random() * emojis.length)]}`);
		return;
	} 

	if ( tweet.user.id !== botsofcode.id ) {
		like(tweet);
		const tweet_url = `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`;
		tweet(`@${me.screen_name} ${tweet_url}`);
	}

});

