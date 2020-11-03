require("dotenv").config()
const {FB, FacebookApiException} = require('fb');
const fs = require('fs')

const postToFacebook = () =>{

    // https://www.npmjs.com/package/fb
    // https://medium.com/@evgeni.leonti/post-to-facebook-page-with-nodejs-379e885033de
    // https://developers.facebook.com/apps/1024563604676052/settings/basic
    // To genderate access token
    //https://developers.facebook.com/tools/explorer
     // https://developers.facebook.com/docs/pages/access-tokens
   // console.log(process.env.facebook_access_token)
 // https://developers.facebook.com/tools/debug/accesstoken/
    FB.setAccessToken(process.env.facebook_page_access_token);
    FB.api(
        '/' + process.env.facebook_page_id + '/feed',
        'POST',
        { "message": "Testing with api" },
        function (response) {
            if (response.error) {
                console.log('error occurred: ' + response.error)
                console.log(response.error)
                return;
            }
            console.log(response)
        }
    );

    FB.api('me/photos', 'post', { source: fs.createReadStream('wall.jpg'), caption: 'Testing posting an image to feed' }, function (res) {
        if(!res || res.error) {
            console.log(!res ? 'error occurred' : res.error);
            return;
        }
        console.log('Post Id: ' + res.post_id);
    });



}

//module.exports = postToFacebook
postToFacebook()

