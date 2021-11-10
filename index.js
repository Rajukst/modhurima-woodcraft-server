const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yyhry.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

console.log(uri);

async function run() {
  try {
    await client.connect();
    const database = client.db("WoodCraft");
    const homeProducts = database.collection("home-Product");
    app.get("/home", async (req, res) => {
      const products = req.body;
      const addProducts = await homeProducts.insertOne(products);
      res.json(addProducts);
      console.log(addProducts);
    });
  } finally {
    // client.close()
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Assignment Twelve Is Running");
});

app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`);
});
