// server.js
// This is the very first file our "shopkeeper" (backend) runs.

const express = require("express"); // bring in the Express library
const cors = require("cors");       // allows our future React app to talk to this server

const app = express(); // create the actual server application

app.use(cors());          // turn on CORS so browsers don't block requests
app.use(express.json());  // allows server to understand JSON data sent to it

const PORT = 5000; // the "door number" our shop will be reachable at

// When someone visits the homepage of our API, send back this message
app.get("/", (req, res) => {
  res.send("API is running");
});

// Start the server and make it listen for requests
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});