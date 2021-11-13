const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;
const ObjectId = require("mongodb").ObjectId;
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
    const totalProducts = database.collection("Products");
    const userInfo = database.collection("User");
    // creating add product service
    app.post("/add-product", async (req, res) => {
      const add = req.body;
      const product = await totalProducts.insertOne(add);
      console.log("getting a product", product);
      res.json(product);
    });
    // showing data to ui
    app.get("/home-product", async (req, res) => {
      const cursor = totalProducts.find({});
      const getHomeProduct = await cursor.toArray();
      res.send(getHomeProduct);
      console.log(getHomeProduct);
    });
    // creating explore page products
    app.get("/explore-products", async (req, res) => {
      const cursorTwo = totalProducts.find({});
      const getExploreProducts = await cursorTwo.toArray();
      res.send(getExploreProducts);
      console.log(getExploreProducts);
    });
    // find products by dynamic Id
    app.get("/place-order/:serviceId", async (req, res) => {
      const productId = req.params.serviceId;
      const query = { _id: ObjectId(productId) };
      const getProduct = await totalProducts.findOne(query);
      console.log("getting product", getProduct);
      res.send(getProduct);
    });
    app.post("/confirmOrder", async (req, res) => {
      const addUser = req.body;
      const user = await userInfo.insertOne(addUser);
      console.log("getting User", user);
      res.json(user);
    });
    // showing my orders in UI
    app.get("/myOrder", async (req, res) => {
      const cursor = userInfo.find({});
      const getOrder = await cursor.toArray();
      res.send(getOrder);
      console.log(getOrder);
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
