const fs = require("firebase-admin");
const port = process.env.PORT || 3000;
const express = require("express");
const cors = require("cors");
const utils = require("./util");
const app = express();
app.use(express.json());
app.use(cors());

const serviceAccount = require("./serviceAccountKey.json");

fs.initializeApp({
    credential: fs.credential.cert(serviceAccount),
});

const db = fs.firestore();

const test = db.collection("testdrivers");

let batch = db.batch();

app.post("/drivers/create", async (req, res) => {
  try {
    const data = req.body;
    console.log(data);
    await test.add(data);
    res.status(200).send({
      status: "OK",
      message: "driver added!!",
      data: data,
    });
  } catch (error) {
    res.send(error);
  }
});

app.get("/drivers/get", async (req, res) => {
  try {
    const driversArray = await test.listDocuments();
    console.log(driversArray);
    res.status(200).send({
      status: "OK",
      message: "drivers fetched!!",
      data: driversArray,
    });
  } catch (error) {
    res.send(error);
  }
});

// testing the batch write
app.post("/drivers/gridpoints/create", async (req, res) => {
  try {
    const data = req.body.id;
    var pRef = db.collection("grid").doc("108");
    batch.set(pRef, { i: 108, j: 5 });

    // Set the value of Child
    var cRef = db.collection("grid").doc("108").collection("45").doc("test");
    batch.set(cRef, { id: data });

    // Commit the batch
    batch.commit().then(function () {
      console.log("Batch write succeeded.");
    });

    res.status(200).send({
      status: "OK",
      message: "grid points added!!",
      data: data,
    });
  } catch (error) {
    res.send(error);
  }
});


app.post("/drivers/update", async (req, res) => {
  try {
    const id = req.body.id;
    const data = req.body.data;
    const updatedDriver = await test.doc(id).update(data);

    res.status(200).send({
      status: "OK",
      message: "driver updated!!",
      data: updatedDriver,
    });
  } catch (error) {
    res.send(error);
  }
});

app.delete("/drivers/delete/:id", async (req, res) => {
  try {
    const response = await db.collection("users").doc(req.params.id).delete();
    res.send(response);
  } catch (error) {
    res.send(error);
  }
});

// get the a lat and lng from user and get the nearest drivers
app.get("/drivers/nearby", async (req, res) => {
  try {
    const lat = req.query.lat;
    const lng = req.query.lng;
    // TODO: Nearby drivers
  } catch (error) {
    res.send(error);
  }
});

// given lat and lng get the i and j
app.get("/drivers/gridindex", async (req, res) => {
  try {
    const lat = req.query.lat;
    const lng = req.query.lng;
    const {i, j} = utils.gridIndex(lat, lng);
    res.status(200).send({
      status: "OK",
      message: "grid index fetched!!",
      i,
      j
    });
  } catch (error) {
    res.send(error);
    
  }
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
