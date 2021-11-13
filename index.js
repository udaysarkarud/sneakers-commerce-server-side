const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const app = express();
const ObjectId = require('mongodb').ObjectId
const port = process.env.PORT || 5000;


//midelware
app.use(cors());
app.use(express.json());



//DB Connection
const uri = `mongodb+srv://${process.env.MONGDB_USERNAM}:${process.env.MONGDB_USERPAS}@cluster0.x6o4r.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


const main = async () => {
    try {
        await client.connect();
        const database = client.db("assignMent12");
        const usersDataCollection = database.collection("usersData");
        const productsDataCollection = database.collection("productsData");
        const ordersDataCollection = database.collection("ordersData");
        const reviewsDataCollection = database.collection("reviewsData");
        const blogsDataCollection = database.collection("blogsData");



        //UserData, Use Role
        app.put('/usersdata', async (req, res) => {
            const userinfo = req.body
            let result;
            if (userinfo.type) {
                const filter = { email: userinfo.email }
                const updateRole = {
                    $set: {
                        role: 'admin'
                    }
                };
                result = await usersDataCollection.updateOne(filter, updateRole);

            } else {
                const filter = { email: userinfo.email }
                const options = { upsert: true };
                const userDoc = {
                    $set: userinfo
                };
                result = await usersDataCollection.updateOne(filter, userDoc, options);
            }
            res.send(result)
        })

        //Get UserData and check role
        app.get('/usersdata/:email', async (req, res) => {
            const activeUser = req.params.email
            const filter = { email: activeUser }

            const result = await usersDataCollection.findOne(filter);
            let isAdmin = false;

            if (result?.role === 'admin') {
                isAdmin = true
            }
            const userRole = { admin: isAdmin }

            res.send(userRole)
        })

        // Add products
        app.post('/products', async (req, res) => {
            const productDetails = req.body
            console.log(productDetails);
            const result = await productsDataCollection.insertOne(productDetails)
            res.send(result)
        })
        // Delete products
        app.delete('/products/:pid', async (req, res) => {
            const getPid = req.params.pid
            console.log(getPid)
            const productId = { _id: ObjectId(getPid) }
            const result = await productsDataCollection.deleteOne(productId)
            res.send(result)
        })
        // Get products
        app.get('/products', async (req, res) => {

            let productsData;

            if (req.query.find) {
                const pdid = req.query.find
                const productId = { _id: ObjectId(pdid) }
                productsData = await productsDataCollection.findOne(productId)
            } else if (req.query.type) {
                const prodocuts = productsDataCollection.find({})
                productsData = await prodocuts.limit(6).toArray()
            } else {
                const prodocuts = productsDataCollection.find({})
                productsData = await prodocuts.toArray()
            }

            res.send(productsData)
        })

        // Add ORders
        app.post('/orders', async (req, res) => {
            const orderDetails = req.body
            console.log(orderDetails);
            const result = await ordersDataCollection.insertOne(orderDetails)
            res.send(result)
        })

        //Change Order Status
        app.put('/orders/:orid', async (req, res) => {
            const getOrId = req.params.orid
            const orderId = { _id: ObjectId(getOrId) }
            const updateStatus = {
                $set: {
                    status: "shipped"
                },
            };
            const result = await ordersDataCollection.updateOne(orderId, updateStatus)
            res.send(result)
        })

        // Delete an order
        app.delete('/orders/:orid', async (req, res) => {
            const getOrId = req.params.orid
            console.log(getOrId)
            const orderId = { _id: ObjectId(getOrId) }
            const result = await ordersDataCollection.deleteOne(orderId)
            res.send(result)
        })
        // Get Orders
        app.get('/orders', async (req, res) => {

            let orderData;

            if (req.query.find) {
                const orId = req.query.find
                const orderId = { _id: ObjectId(orId) }
                orderData = await ordersDataCollection.findOne(orderId)
            } else if (req.query.type) {
                const orders = ordersDataCollection.find({})
                orderData = await orders.limit(3).toArray()
            } else if (req.query.search) {
                const user = req.query.search
                const userEnail = { clientEmail: user }
                const userOrders = ordersDataCollection.find(userEnail)
                orderData = await userOrders.toArray()
            } else {
                const orders = ordersDataCollection.find({})
                orderData = await orders.toArray()
            }

            res.send(orderData)
        })

        // Add review
        app.post('/reviews', async (req, res) => {
            const reviewDetails = req.body
            console.log(reviewDetails);
            const result = await reviewsDataCollection.insertOne(reviewDetails)
            res.send(result)
        })
        // Get review
        app.get('/reviews', async (req, res) => {
            const reviews = reviewsDataCollection.find({})
            const result = await reviews.limit(10).toArray()
            res.send(result)
        })

        // Add blog
        app.post('/blogs', async (req, res) => {
            const blogDetails = req.body
            console.log(blogDetails);
            const result = await blogsDataCollection.insertOne(blogDetails)
            console.log(result);
            res.send(result)
        })
        // get blog
        app.get('/blogs', async (req, res) => {

            let blogsData;

            if (req.query.find) {
                const bgid = req.query.find
                const blogId = { _id: ObjectId(bgid) }
                blogsData = await blogsDataCollection.findOne(blogId)
            } else if (req.query.type) {
                const blogs = blogsDataCollection.find({})
                blogsData = await blogs.limit(3).toArray()
            } else {
                const blogs = blogsDataCollection.find({})
                blogsData = await blogs.toArray()
            }

            res.send(blogsData)
        })
    }

    finally {

    }
}

main().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Hello from backend')
})

app.listen(port, () => {
    console.log(`listening Port:${port}`)
})