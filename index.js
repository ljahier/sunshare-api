const express = require('express')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient;

const port = process.env.PORT || 8081
const app = express()
const mongodbUrl = "mongodb://localhost:27017"
const dbName = "hackathon"


app.use(bodyParser.json())

app.get('/data', (req, res) => {
    let client = new MongoClient(mongodbUrl, { useNewUrlParser: true })
    client.connect((err, client) => {
        if (err) throw err
        let db = client.db(dbName)
        db.collection('raw_data').find({}).toArray(function (err, result) {
            if (err) throw err;
            // console.log(result)
            res.json(result)
            client.close()
        })
    })
})

app.get('/data/:clientID', (req, res) => {
    let raw_client_id = req.params.clientID;
    let raw_timestamp = req.query.t;
    console.log(raw_timestamp);
    let client = new MongoClient(mongodbUrl, { useNewUrlParser: true })
    client.connect((err, client) => {
        if (err) throw err
        let db = client.db(dbName)
        db.collection('raw_data').find({ client_id: raw_client_id }, { projection: { _id: 0 } }).toArray(function (err, result) {
            if (err) throw err;
            // console.log(result)
            res.json(result)
            client.close()
        })
    })

})

app.get('/data/:clientID/:requested', (req, res) => {
    let raw_client_id = req.params.clientID;
    let raw_requested = req.params.requested

    let client = new MongoClient(mongodbUrl, { useNewUrlParser: true })
    client.connect((err, client) => {
        if (err) throw err
        let db = client.db(dbName)

        db.collection('raw_data').find({ client_id: raw_client_id }, { projection: { _id: 0, [raw_requested]: 1, timestamp: 1 }, limit: 100}).sort({'timestamp': -1}).toArray(function (err, result) {
            if (err) throw err;
            // console.log(result)
            res.json(result)
            client.close()
        })
    })

})

app.post('/data', (req, res) => {
    let client = new MongoClient(mongodbUrl, { useNewUrlParser: true })
    let raw_data = req.body
    client.connect((err, client) => {
        if (err) throw err
        // console.log("Connected correctly to server")
        const db = client.db(dbName)

        db.collection('raw_data').insertMany([raw_data], (err, results) => {
            if (err) throw err
            // console.log(results)
            res.end(0)
            client.close()
        })
    })
})

app.listen(port, () => console.log(`Server running on localhost:${port}`))

