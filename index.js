// moyenne de chaque données recus en 1min (1h en réalité mais 1 min pour les tests)

/**
 * DATASHEET
 * { timestamp: 1556349517041,
 * time: '2019-04-27T07:18:37.041Z',
 * soutiridx: 7003029.282917704,
 * injectidx: 47314120.48230915,
 * prodidx: 41956011.44329988,
 * autoconsoidx: 1641889.9609907167,
 * prodmoyidx: 43287763.43958055,
 * prodmaxidx: 79575527.8791611 }
 */

const express = require('express')
const bodyParser = require('body-parser')
const port = process.env.PORT || 8081
const app = express()
const fs = require('fs')

app.use(bodyParser.json())

app.get('/', (req, res) => {

})

app.get('/data', (req, res) => {
    fs.readFile('message.txt', (err, results) => {
        res.write(results)
    })
})

app.post('/data', (req, res) => {
    let raw_data = req.body
    let soutiridx = parseFloat(raw_data.soutiridx.toFixed(2))
    let injectidx = parseFloat(raw_data.injectidx.toFixed(2))
    let prodidx = parseFloat(raw_data.prodidx.toFixed(2))
    let autoconsoidx = parseFloat(raw_data.autoconsoidx.toFixed(2))
    let clientid = raw_data.clientid
    let timestamp = raw_data.timestamp

    console.log(soutiridx)
    console.log(injectidx)
    console.log(prodidx)
    console.log(autoconsoidx)
    console.log(clientid)
    console.log(timestamp)

    fs.writeFile('message.txt', JSON.stringify(raw_data)+'\n', { flag: "a" }, (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    });
    fs.close(0)


    console.log(JSON.stringify(raw_data))
})

app.listen(port, () => {
    console.log(`Server running on localhost:${port}`)
})
