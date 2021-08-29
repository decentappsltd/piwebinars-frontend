const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://olivercrockett:<Ol1vermc>@cluster0.6eamu.mongodb.net/Pi%20Webinars?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});
