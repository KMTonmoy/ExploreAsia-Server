const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors());
app.use(express.json()); 



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vdvrsjh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }

});

async function run() {
    try {

        // await client.connect();
        const countryCollection = client.db('CountryDB').collection('Country');
        const couCollection = client.db('CountryDB').collection('Con');

        app.get('/country', async (req, res) => {
            const cursor = countryCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        });
        app.get('/con', async (req, res) => {
            const cour = couCollection.find();
            const result = await cour.toArray();
            res.send(result);
        });



        app.post('/country', async (req, res) => {
            const newCountry = req.body;
            console.log(newCountry);
            const result = await countryCollection.insertOne(newCountry);
            res.send(result);
        });



        app.get('/country/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await countryCollection.findOne(query);
            res.send(result);
        })

        app.put('/country/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updateSpot = req.body;
            const Spot = {
                $set: {
                    image: updateSpot.image,
                    tourists_spot_name: updateSpot.tourists_spot_name,
                    country_Name: updateSpot.country_Name,
                    location: updateSpot.location,
                    description: updateSpot.description,
                    average_cost: updateSpot.average_cost,
                    seasonality: updateSpot.seasonality,
                    travel_time: updateSpot.travel_time,
                    totaVisitorsPerYear: updateSpot.totaVisitorsPerYear,
                }
            }


            const result = await countryCollection.updateOne(filter, Spot, options);
            res.send(result);
        })



        app.delete('/country/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await countryCollection.deleteOne(query);
            res.send(result);
        })



        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {

    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('ExploreAsia Server Is Running !');
});

app.listen(port, () => {
    console.log(`ExploreAsia Server Is Running on port ${port}`);
});
