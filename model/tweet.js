require("dotenv").config()
const Twitter = require('twitter');

const tweet = () =>{

    // https://developer.twitter.com/en/apps
    // https://www.npmjs.com/package/twitter
    const client = new Twitter({
        consumer_key: process.env.twitter_consumer_api_key,
        consumer_secret: process.env.twitter_consumer_secret_key,
        access_token_key: process.env.twitter_access_token,
        access_token_secret: process.env.twitter_access_token_secret
    });

    client.post('statuses/update', {status: 'This is a test.'},  function(error, tweet, response) {
        if(error) throw error;
        console.log(tweet);  // Tweet body.
        console.log(response);  // Raw response object.
    });
}

expore.modules = tweet