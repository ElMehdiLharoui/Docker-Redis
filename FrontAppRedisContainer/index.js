const redis = require("redis");
require("dotenv").config();
const express = require("express");
const request = require("request");
const app = express();
//  this  is to accept  data in json format
app.use(express.json());
// this is basically to decode the data
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/Public/index.html`);
});
app.post("/post", async (req, res) => {
  var data = req.body;
  const cli = await client();
  cli.set("Banck", data.Banck);

  request.post(
    "http://container_client_redis:27019/post",
    async (err, resp, body) => {
      if (err) {
        res.send(err);
      } else {
        await cli.get("Banck");
        console.log(body);
        res.send(body);
      }
    }
  );
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
  console.log(`App listening at http://localhost:${process.env.PORT}`);
  await client();
});
