
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000

// .env 
require('dotenv').config()
const app = express()

const { query } = require('express');

// middle ware
app.use(cors())
app.use(express.json())


app.get('/', (req, res) => {
    res.send("glamygirl  is running")
})

app.listen(port, () => {
    console.log(`Server running at port ${port}`)
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.feigjta.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });





async function run() {
    try {

        const categories = client.db("glamy-girl").collection("categories")
        const products = client.db("glamy-girl").collection("products")
        const addProducts = client.db("glamy-girl").collection("addProducts")
        const addUsers = client.db("glamy-girl").collection("addUsers")
        const orders = client.db("glamy-girl").collection("orders")
   
        app.get('/categories', async (req, res) => {
            const query = {}
            const result = await categories.find(query).toArray()
            res.send(result)
        })

        app.get('/products/:brand', async (req, res) => {
            const brand = req.params.brand;
            const query = { brand: brand };
            const result = await products.find(query).toArray()
            res.send(result);
        });
        app.get('/orders', async (req, res) => {
            const query = {}
            const result = await orders.find(query).toArray()
            res.send(result)
        });

        app.post('/orders', async (req, res) => {
            const order = req.body;
            console.log(order)
            const query = {
                name: order.name,
               
            }
            const alreadyBooked = await orders.find(query).toArray();
            if (alreadyBooked.length) {
                const message = `You already have ordered ${order.name}`
                return res.send({ acknowledged: false, message })
            }
            const result = await orders.insertOne(order);
            res.send(result);

        });

        app.get('/addProduct', async (req, res) => {
            const query = {};
            const result = await addProducts.find(query).toArray();
            res.send(result);
        })

        app.post('/addProduct', async (req, res) => {
            const product = req.body;
            const result = await addProducts.insertOne(product);
            res.send(result);
        })

        app.get('/addUser', async (req, res) => {
            const query = {};
            const result = await addUsers.find(query).toArray();
            res.send(result);
        })

        app.post('/addUser', async (req, res) => {
            const user = req.body;
            const result = await addUsers.insertOne(user);
            res.send(result);
        })
    }

    finally {

    }
}
run().catch(console.log)