const express = require("express");
const cors = require("cors");
require("./db/config");

const User = require("./db/User");
const Product = require("./db/Product");
const app = express();
app.use(express.json());
app.use(cors());

app.post("/register", async (req, resp) => {
  console.warn(req.body);
  let user = new User(req.body);
  let result = await user.save();
  result = result.toObject();
  // delete result.passward;

  resp.send(result);
});

app.post("/login", async (req, resp) => {
  console.log(req.body.passward);
  console.log(req.body.email);
  if (req.body.email && req.body.passward) {
    let user = await User.findOne(req.body); //.select("-passward");
    if (user) {
      resp.send(user);
      console.log(user);
    } else {
      resp.send({ result: "User Not Found" });
    }
  } else {
    resp.send({ result: "User Not Found" });
  }
});

app.post("/add-product", async (req, resp) => {
  let product = new Product(req.body);
  let result = await product.save();
  resp.send(result);
});

app.get("/products", async (req, resp) => {
  let products = await Product.find();
  // resp.send(products);

  if (products.length > 0) {
    resp.send(products);
  } else {
    resp.send({ result: "No Product Found" });
  }
});

app.delete("/products/:id", async (req, resp) => {
  const result = await Product.deleteOne({ _id: req.params.id });
  resp.send(result);
});

app.get("/products/:id", async (req, resp) => {
  let result = await Product.findOne({ _id: req.params.id });

  // resp.send(result);

  if (result) {
    resp.send(result);
  } else {
    resp.send({ result: "Record not found" });
  }
});

app.put("/product/:id", async (req, resp) => {
  let result = await Product.updateOne(
    { _id: req.params.id },
    {
      $set: req.body,
    }
  );
  resp.send(result);
});

app.get("/search/:key", async (req, resp) => {
  let result = await Product.find({
    $or: [
      { name: { $regex: req.params.key } },
      { category: { $regex: req.params.key } },
      // { price: { $regex: req.params.key } },
      { company: { $regex: req.params.key } },
    ],
  });
  resp.send(result);
});

app.listen(4000);

// {
// 	"name":"kiran",
// 	"email":"kiran@test.in",
// 	"passwaord":"dekstop",
// 	"address":"ane",
// 	"city":"karad",
// 	"pincode":415103
// }

// { "name": "note 10",
//   "price": 14999,
//   "category": "mobile",
//   "userid": "kiran4545",
//   "company":"vivo"
// }
