require("dotenv").config()
const Twitter = require('twitter');

const tweet = (message, callback) =>{

    // https://developer.twitter.com/en/apps
    // https://www.npmjs.com/package/twitter
    const client = new Twitter({
        consumer_key: process.env.twitter_consumer_api_key,
        consumer_secret: process.env.twitter_consumer_secret_key,
        access_token_key: process.env.twitter_access_token,
        access_token_secret: process.env.twitter_access_token_secret
    });

    if (undefined !== message.images && message.images.length > 0) {

        const path = "./media/images/" + message.images[Math.floor(Math.random() * message.images.length)];
        const data = require('fs').readFileSync(path);

        console.log('Got image: ' + path)
        console.log('Posting media')

        // Make post request on media endpoint. Pass file data as media parameter
        client.post('media/upload', {media: data}, function(error, media, response) {

            if (error) {
                console.log(error)
                process.exit()
            }

            // If successful, a media object will be returned.
            console.log("Twitter, media object:")
            console.log(media);

            // Lets tweet it
            const status = {
                status: message.hashtags,
                media_ids: media.media_id_string // Pass the media id string
            }

            client.post('statuses/update', status, function(error, tweet, response) {
                if (error) throw error;
                callback(response)
            });
        })

    } else {

        console.log("No image found")

        client.post('statuses/update', {status: message.text}, function (error, tweet, response) {
            if (error) throw error;
            callback(response)
        });

    }

}

module.exports = tweet