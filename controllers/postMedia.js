require("dotenv").config()
// Install using npm install mongodb --save
const MongoClient = require('mongodb').MongoClient
const assert = require('assert');
const { DateTime } = require('luxon');
const postToFacebook = require('../model/postToFacebook')
const postToInstagram = require('../model/postToInstagram')

class postMedia {

    constructor() {

        this.uri = "mongodb+srv://" + process.env.MONGODBUSER + ":" + process.env.MONGODBPASSWORD + "@cluster0.awqh6.mongodb.net/chemistry?retryWrites=true&w=majority";
        this.client = new MongoClient(this.uri, { useNewUrlParser: true, useUnifiedTopology: true });

    }

    send() {


        this.client.connect(err => {

            assert.equal(err, null);
            const db = this.client.db("autosocial")
            var ObjectID = require('mongodb').ObjectID;

            const now = DateTime.local()


            // Instagram
            db.collection("mdma").find({$or:[{'last_sent.instagram':null}, {'last_sent_instagram':{"$lte":DateTime.local().minus({'days':1}).toISODate()}}]}, {'$sort':{'rand':1}}).toArray((err, messages) => {
                if (err) {
                    reject(err)
                }

                messages = messages.filter((message)=>{
                    return message.images !== undefined
                })

                if (messages !== null && messages.length > 0) {
                    const message = messages[Math.floor(Math.random()* messages.length)]
                    // DateTime.fromISO('2017-05-15').ts
                    // Instagram
                    if (undefined === message.last_sent || undefined === message.last_sent.instagram || DateTime.fromISO(message.last_sent.instagram).plus({days:1}).ts < now.ts) {
                        postToInstagram(message, (response)=> {
                            db.collection("mdma").updateOne({_id:ObjectID(message._id)}, {$set:{"last_sent.instagram": now.toISODate()}}, (err, result)=>{
                                if (err) {
                                    console.log(err)
                                    process.exit()
                                }
                                console.log("Successfully posted to Instagram")
                                console.log(message)



                            })
                        })
                    }

                }
            })


            // Facebook
            db.collection("mdma").find({$or:[{'last_sent.facebook':null}, {'last_sent_facebook':{"$lte":DateTime.local().minus({'days':1}).toISODate()}}]}, {'$sort':{'rand':1}}).toArray((err, messages) => {
                if (err) {
                    reject(err)
                }

                if (messages !== null && messages.length > 0) {
                    const message = messages[Math.floor(Math.random()* messages.length)]
                    // DateTime.fromISO('2017-05-15').ts
                    // Facebook
                    if (undefined === message.last_sent || undefined === message.last_sent.facebook || DateTime.fromISO(message.last_sent.facebook).plus({days:1}).ts < now.ts) {
                        postToFacebook(message, (response)=> {
                            db.collection("mdma").updateOne({_id:ObjectID(message._id)}, {$set:{"last_sent.facebook": now.toISODate()}}, (err, result)=>{
                                if (err) {
                                    console.log(err)
                                    process.exit()
                                }
                                console.log("Successfully posted to Facebook")
                                console.log(message)
                            })
                        })
                    }



                }
            })





        })
    }

}

module.exports = postMedia