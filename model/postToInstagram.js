require("dotenv").config('/home/kdavies/Development/autosocial/.env')
const {IgApiClient} = require('instagram-private-api');
const {readFile} = require('fs')
const {promisify} = require('util')
const readFileAsync = promisify(readFile);
const uniqid = require('uniqid');

const postToInstagram = (message, callback) =>{

    console.log(posttoinstagram)

    // https://www.npmjs.com/package/instagram-private-api
    // https://github.com/dilame/instagram-private-api/blob/5dd6b8d5852cb4b51eaf35e9bcc856f7ef9ec52b/examples/upload-photo.example.ts
    const ig = new IgApiClient()
    ig.state.generateDevice(process.env.instagram_username);

    async function login() {
        // basic login-procedure
        ig.state.generateDevice(process.env.instagram_username);
        await ig.account.login(process.env.instagram_username, process.env.instagram_password);
    }

    (async () => {
        await login();

        const path = process.env.FULLPATH + "media/images/" + message.images[Math.floor(Math.random() * message.images.length)];
        const { latitude, longitude, searchQuery } = {
            latitude: 0.0,
            longitude: 0.0,
            // not required
            searchQuery: 'place',
        };

        /**
         * Get the place
         * If searchQuery is undefined, you'll get the nearest places to your location
         * this is the same as in the upload (-configure) dialog in the app
         */
        const locations = await ig.search.location(latitude, longitude, searchQuery);

        /**
         * Get the first venue
         * In the real world you would check the returned locations
         */
        const mediaLocation = locations[0];

        const publishResult = await ig.publish.photo({
            // read the file into a Buffer
            file: await readFileAsync(path),
            caption: uniqid() +  ' https://givealittle.co.nz/donate/cause/campaign-to-get-mdma-de-scheduled ' + message.hashtags
        })

        callback(publishResult)


    })();

}

module.exports = postToInstagram


