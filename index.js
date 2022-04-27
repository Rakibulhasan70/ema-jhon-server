const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
// dotenv import
require('dotenv').config();


// middlewear
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hmuzh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const productCollection = client.db('emaJhon').collection('product');

        app.get('/product', async (req, res) => {
            console.log('query', req.query);
            const page = parseInt(req.query.page);
            const size = parseInt(req.query.size);
            const query = {};
            const cursor =
                productCollection.find(query);
            let products;
            if (page || size) {
                products = await cursor.
                    skip(page * size).limit(size).toArray()
            }
            else {
                products = await cursor.toArray()
            }

            res.send(products);
        });

        app.get('/productCount', async (req, res) => {
            const count = await productCollection.estimatedDocumentCount();
            res.send({ count })
        })


    }
    finally {

    }

}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('jhon is running and waiting for ema')
});
app.listen(port, () => {
    console.log('jhon is runnig on port', port);
})