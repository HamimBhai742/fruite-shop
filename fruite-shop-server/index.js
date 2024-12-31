const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PROT || 5000;
app.use(express.json());
app.use(express.urlencoded());
require("dotenv").config();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://fruite-shop-742.netlify.app",
      "https://fruite-shop-server.vercel.app",
    ], // Your frontend origin
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
    credentials: true, // Allow credentials (cookies, auth headers)
  })
);

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri =
  "mongodb+srv://job_task_again:ScFC0UHSyRLHKDOc@cluster0.bls3tyg.mongodb.net/bloodDB?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    const database = client.db("fruiteDB");
    const fruiteCollection = database.collection("fruite");
    const cartCollection = database.collection("fruiteCart");
    app.post("/user", async (req, res) => {
      const user = req.body;
      console.log(user);
      const result = await fruiteCollection.insertOne(user);
      res.send(result);
    });
    app.get("/fruites", async (req, res) => {
      const result = await fruiteCollection.find().toArray();
      res.send(result);
    });
    app.get("/fruite/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await fruiteCollection.findOne(query);
      res.send(result);
    });
    app.post("/add-to-cart", async (req, res) => {
      const carts = req.body;
      const result = await cartCollection.insertOne(carts);
      res.send(result);
    });
    app.get("/cart-item/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await cartCollection.find(query).toArray();
      res.send(result);
    });

    app.delete("/cart-fruite-delete/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: id };
      const options = {};
      const result = await cartCollection.deleteOne(query, options);
      res.send(result);
    });

    app.delete("/pay-confirm/:email", async (req, res) => {
      const id = req.params.email;
      const query = {
        email: id,
      };
      const result = await cartCollection.deleteMany(query);
      res.send(result);
    });

    // app.get("/searchProduct", async (req, res) => {
    //   const search = req.query.search;
    //   const query = {
    //     productName: {
    //       $regex: search,
    //       $options: "i",
    //     },
    //   };
    //   const result = await productCollection.find(query).toArray();

    //   res.send(result);
    // });
    // app.get("/productsCount", async (req, res) => {
    //   const count = await cartCollection.estimatedDocumentCount();
    //   res.send({ count });
    // });

    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Fruite Shop Server Is Running.......");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
