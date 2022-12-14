const express = require("express");
const app = express();
const cors = require("cors");
const dotEnv = require("dotenv");
const multer = require("multer");
const upload = multer({
  dest: "data",
});
const fs = require("fs");
const Axios = require("axios");

// configure cors
app.use(cors());

// configure express to receive form data
app.use(express.json());

// configure dotEnv
dotEnv.config({ path: "./.env" });

const port = process.env.PORT || 7780;

// simple request
app.get("/", (request, response) => {
  response.send(`<h2>/find for the post api to search address</h2>`);
});

// router configuration
app.post("/find", upload.single("userData"), async (request, response) => {
  try {
    const { address, limit } = request.body;
    const { path } = request.file;
    const latlong = [];
    if (address != undefined && limit != undefined) {
      const API_KEY = process.env.API_KEY;
      console.log("converting addresssss-----------------");
      const URL = `https://geocoder.ls.hereapi.com/search/6.2/geocode.json?apiKey=${API_KEY}&languages=en-US&maxresults=${limit}&searchtext=${address}`;
      const locationData = await Axios.get(URL);
      locationData.data.Response.View[0].Result.map((item) => {
        const locData = {
          Latitude: 0,
          Longitude: 0,
        };
        locData.Latitude = item.Location.DisplayPosition.Latitude;
        locData.Longitude = item.Location.DisplayPosition.Longitude;
        latlong.push(locData);
      });
    }
    //
    //
    //
    //

    // find address in userData
    const UserData = [];

    fs.readFile(path, "utf8", (err, data) => {
      if (err) throw err;
      const Locations = [];
      let counter = 0;
      UserData.push(JSON.parse(data));

      UserData[0].locations.map((item) => {
        const lat = +(item.latitudeE7 / 10000000).toFixed(2);
        const lon = +(item.longitudeE7 / 10000000).toFixed(2);
        latlong.map((add) => {
          const ADDLAT = +add.Latitude.toFixed(2);
          const ADDLONG = +add.Longitude.toFixed(2);

          if (lat == ADDLAT && lon == ADDLONG) {
            Locations.push(item);
            ++counter;
          }
        });
      });
      response.status(200).json({
        msg: "Locations Found      " + counter + "         times",
        data: Locations,
      });
    });
  } catch (error) {
    console.error(error);
    response.status(500).json({ errors: [{ msg: error.message }] });
  }
});
app.listen(port, () => {
  console.log(`Express Server is started at PORT : ${port}`);
});
