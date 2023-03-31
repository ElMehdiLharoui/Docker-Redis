const redis = require("redis");
require("dotenv").config();
const express = require("express");

const mongoose = require("mongoose");
const BankModel = require("./models/bank.models");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const options = { useNewUrlParser: true, useUnifiedTopology: true };
// mongoose.conn

async function mongoConnect() {
  await mongoose.connect(process.env.MONGODB_URL, options, () =>
    console.log("connected to db")
  );
}

app.post("/post", async (req, res) => {
  try {
    
    const cli = await client();
    const banck = await cli.get("Banck");
    const bank = new BankModel({ name: banck });
    await bank.save();
    res.status(201).send({
      message: "bank created",
    });
  } catch (error) {
    res.status(500).send({
      message: `error : ${error.message}`,
    });
  }
});
async function client() {
  const client = redis.createClient({
    url: "redis://redis:6379",
    socket: {
      connectTimeout: 60000,
      keepAlive: 60000,
    },
  });

  client.on("error", (err) => console.error("client error", err));
  client.on("connect", () => console.log("client is connect"));
  client.on("reconnecting", () => console.log("client is reconnecting"));
  client.on("ready", () => console.log("client is ready"));

  await client.connect();

  return client;
}
app.listen(process.env.PORT, async () => {
  // eslint-disable-next-line no-console
  console.log(`App listening at http://localhost:${process.env.PORT}`),
    mongoConnect();
  await client();
});
