const express = require("express");
const redis = require("redis");
const app = express();

let publisher = redis.createClient({
  url: "redis://localhost:6379",
});

publisher.on("error", (err) => console.log("Redis error"));
publisher.on("connect", (err) => console.log("Redis Connect"));

const connect = async () => {
  await publisher.connect();
};
connect();

app.listen(3001, () => {
  console.log("publisher running");
});

app.get("/", (req, res) => {
  res.send({
    message: "publisher active from 3001",
  });
});

app.get("/publish", async (req, res) => {
  const id = Math.floor(Math.random() * 10);
  const data = {
    id,
    message: `message-${id}`,
  };
  await publisher.publish("message", JSON.stringify(data));

  res.send({
    message: "Data published",
    data: data,
  });
});
