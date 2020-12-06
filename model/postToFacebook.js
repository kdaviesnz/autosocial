require("dotenv").config()
const {FB, FacebookApiException} = require('fb');
const fs = require('fs')
const uniqid = require('uniqid');

const postToFacebook = (message, callback) =>{

    // https://www.npmjs.com/package/fb
    // https://medium.com/@evgeni.leonti/post-to-facebook-page-with-nodejs-379e885033de
    // https://developers.facebook.com/apps/1024563604676052/settings/basic
    // To genderate access token
    //https://developers.facebook.com/tools/explorer
    // https://developers.facebook.com/docs/pages/access-tokens
    // console.log(process.env.facebook_access_token)
    // https://developers.facebook.com/tools/debug/accesstoken/

    FB.setAccessToken(process.env.facebook_page_access_token);

    if (undefined===message.images) {

        message.text = uniqid() + ' ' + message.text
        FB.api(
            '/' + process.env.facebook_page_id + '/feed',
            'POST',
            { "message": message.text },
            function (response) {
                if (response.error) {
                    console.log('error occurred: ' + response.error)
                    console.log(response.error)
                    return;
                }
                callback(response)
            }
        )
    } else {
        FB.api('/' + process.env.facebook_page_id + '/photos', 'POST', {
            source: fs.createReadStream("./media/images/" + message.images[Math.floor(Math.random() * message.images.length)]),
            caption:message.hashtags
        }, function (res) {
            if (!res || res.error) {
                console.log(!res ? 'error occurred' : res.error);
                return;
            }
            callback(res)
        });
    }
}

module.exports = postToFacebook


