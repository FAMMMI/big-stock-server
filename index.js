const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5chs92e.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const carCollection = client.db('big-stock').collection('cars');

        app.get('/car', async (req, res) => {
            const query = {};
            const cursor = carCollection.find(query);
            const cars = await cursor.toArray();
            res.send(cars);
        })

        app.get('/car/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await carCollection.findOne(query);
            res.send(result);
        })

        app.put('/car/:id', async (req, res) => {
            const id = req.params.id;
            const newItem = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    name: newItem.name, img: newItem.img, price: newItem.price, Supplier: newItem.Supplier, year: newItem.year, color: newItem.color, stock: newItem.stock
                }
            };
            const result = await carCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        })


    }
    finally {

    }
}
run().catch(console.dir);


console.log(uri);
app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})