require("dotenv").config()
// Install using npm install mongodb --save
const MongoClient = require('mongodb').MongoClient
const assert = require('assert');

class postMedia {

    constructor() {

        const uri = "mongodb+srv://" + process.env.MONGODBUSER + ":" + process.env.MONGODBPASSWORD + "@cluster0.awqh6.mongodb.net/chemistry?retryWrites=true&w=majority";
        this.client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    }

    send() {

        this.client.connect(err => {

            assert.equal(err, null);
            const db = this.client.db("autosocial")

            db.collection("mdma").find({}).toArray((err, messages) => {
                if (err) {
                    reject(err)
                }
                if (messages !== null) {
                   (messages.map((message)=>{
                       console.log(message.text)
                   }))
                }
                process.exit()
            })

        })
    }

}

module.exports = postMedia