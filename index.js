const express = require('express')
const cors = require('cors')
const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000;

//middlewire
app.use(express.json())
app.use(cors())



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.df1ioxo.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");


    const productsCollection = client.db('ema-john-collection').collection('products')
    
    app.get('/products',async(req,res)=>{
      console.log(req.query)
      const page = parseInt(req.query.page) || 0;
      const limit = parseInt(req.query.limit) || 10;
      const skip = page*limit;
        const products = await productsCollection.find().skip(skip).limit(limit).toArray()
        res.send(products);
    })

    app.get('/totalProducts',async(req,res)=>{
      const totalProducts = await productsCollection.estimatedDocumentCount();
      res.send({totalProducts: totalProducts})
    })

    app.post('/productByIds',async(req,res)=>{
      const ids = req.body;
      console.log(ids)
      const objectIds = ids.map(id=> new ObjectId(id))
      const query = {_id: {$in: objectIds}}
      const result = await productsCollection.find(query).toArray();
      res.send(result)
    })

  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);




app.get('/',(req,res)=>{
    res.send('Hello World')
})

app.listen(port);

