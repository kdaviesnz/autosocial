
require("dotenv").config({path:'/home/kdavies/Development/autosocial/.env'})
// Install using npm install mongodb --save
const MongoClient = require('mongodb').MongoClient
const assert = require('assert');
const { DateTime } = require('luxon');
const postToFacebook = require('../model/postToFacebook')
const postToInstagram = require('../model/postToInstagram')
const tweet = require('../model/tweet')

class postMedia {

    constructor() {

        this.uri = "mongodb+srv://" + process.env.MONGODBUSER + ":" + process.env.MONGODBPASSWORD + "@cluster0.awqh6.mongodb.net/chemistry?retryWrites=true&w=majority";
        //console.log(this.uri)
        this.client = new MongoClient(this.uri, { useNewUrlParser: true, useUnifiedTopology: true });

    }

    send(media) {


        this.client.connect(err => {

            if (err !== null) {
                console.log("Error connecting to mongo database")
                process.exit()
            } else {
                console.log("Connected to database ok, proceeding ...")
            }
            //process.exit()
            const db = this.client.db("autosocial")
            var ObjectID = require('mongodb').ObjectID;

            const now = DateTime.local()

//            console.log("Media:"+media)
  //          console.log(mmmedia)


            switch (media) {
                case 'instagram':
                    // Instagram
                    //  db.collection("mdma").find({$or:[{'last_sent.instagram':null}, {'last_sent_instagram':{"$lte":DateTime.local().minus({'days':1}).toISODate()}}]}, {'$sort':{'rand':1}}).toArray((err, messages) => {
                    db.collection("mdma").find({}, {'$sort':{'rand':1}}).toArray((err, messages) => {


                        if (err) {
                            console.log("DB Error posting to instagram")
                            console.log(err)
                            process.exit()
                        }

                        messages = messages.filter((message)=>{
                            return message.images !== undefined
                        })

                        if (messages !== null && messages.length > 0) {
                            const message = messages[Math.floor(Math.random()* messages.length)]
                            // DateTime.fromISO('2017-05-15').ts
                            // Instagram
                            console.log(message)
                            console.log(mmmmssage)
                          //  if (undefined === message.last_sent || undefined === message.last_sent.instagram || DateTime.fromISO(message.last_sent.instagram).plus({days:1}).ts < now.ts) {
                                console.log('Posting to instagram:')
                                console.log(message)
                                postToInstagram(message, (response)=> {
                                    db.collection("mdma").updateOne({_id:ObjectID(message._id)}, {$set:{"last_sent.instagram": now.toISODate()}}, (err, result)=>{
                                        if (err) {
                                            console.log(err)
                                            process.exit()
                                        }
                                        console.log("Successfully posted to Instagram")
                                        console.log(message)
                                        process.exit()
                                    })
                                })
                           // }

                        }
                    })

                    break;
                case 'facebook':
                    // Facebook
                    db.collection("mdma").find({$or:[{'last_sent.facebook':null}, {'last_sent_facebook':{"$lte":DateTime.local().minus({'days':1}).toISODate()}}]}, {'$sort':{'rand':1}}).toArray((err, messages) => {

                        if (err) {
                            console.log("Error posting to facebook")
                            console.log(err)
                            process.exit()
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
                                        process.exit()
                                    })
                                })
                            }
                        }
                    })
                    break
                case 'twitter':
                    console.log("Sending tweet")
                    db.collection("mdma").find({$or:[{'last_sent.twitter':null}, {'last_sent_twitter':{"$lte":DateTime.local().minus({'days':1}).toISODate()}}]}, {'$sort':{'rand':1}}).toArray((err, messages) => {

                        if (err) {
                            console.log("Error posting to twitter")
                            console.log(err)
                            process.exit()
                        }

                        if (messages !== null && messages.length > 0) {
                            const message = messages[Math.floor(Math.random()* messages.length)]
                            if (undefined === message.last_sent || undefined === message.last_sent.twitter || DateTime.fromISO(message.last_sent.twitter).plus({days:1}).ts < now.ts) {
                                tweet(message, (response)=> {
                                    db.collection("mdma").updateOne({_id:ObjectID(message._id)}, {$set:{"last_sent.twitter": now.toISODate()}}, (err, result)=>{
                                        if (err) {
                                            console.log(err)
                                            process.exit()
                                        }
                                        console.log("Successfully tweeted")
                                        console.log(message)
                                        process.exit()
                                    })
                                })
                            } else {
                                console.log('Already tweeted')
                                process.exit()
                            }
                        } else {
                            console.log("No tweets found")
                            process.exit()
                        }
                    })
                    break

            }


        })
    }

}

module.exports = postMedia