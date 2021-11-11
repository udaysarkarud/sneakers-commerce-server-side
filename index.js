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

        /* const tourBookingCollection = database.collection("bookings");
        const blogsCollection = database.collection("blogs"); */

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