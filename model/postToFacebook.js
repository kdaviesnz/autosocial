require("dotenv").config()
const {FB, FacebookApiException} = require('fb');


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
        '/109267807654573/feed',
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



}

//module.exports = postToFacebook
postToFacebook()

