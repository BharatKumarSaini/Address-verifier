const express = require("express");
const app = express();
const cors = require("cors");
const dotEnv = require("dotenv");
const { body, validationResult, file } = require("express-validator");
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

const port = process.env.PORT || 5000;

// simple request
app.get("/", (request, response) => {
  response.send(`<h2>aur bhai kya haal h ???</h2>`);
});

// router configuration
app.post("/find", upload.single("userData"), async (request, response) => {
  try {
    const { cityName, stateCode, countryCode, limit } = request.body;
    const { path } = request.file;
    let lattitude = 0;
    let longitude = 0;
    console.log(request.file);

    // convert address into lat long
    // console.log(address);
    if (cityName != undefined && stateCode != undefined) {
      const API_KEY = process.env.API_KEY;
      if (limit) {
        console.log("converting addresssss-----------------");
        const URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName},${stateCode},${countryCode}&limit=${limit}&appid=${API_KEY}`;
        const locationData = await Axios.get(URL);
      } else {
        console.log("converting addresssss-----------------");
        const URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName},${stateCode}&appid=${API_KEY}`;
        const locationData = await Axios.get(URL);
        // console.log(locationData);
        locationData.data.map((item) => {
          lattitude = item.lat;
          longitude = item.lon;
          console.log(lattitude, longitude);
        });
      }
    }
    // find address in userData
    const UserData = [];
    const Locations = [];

    fs.readFile(path, "utf8", (err, data) => {
      if (err) throw err;
      UserData.push(JSON.parse(data));

      UserData[0].locations.map((item) => {
        // console.log(
        //   item.latitudeE7 +
        //     "------------------------------------" +
        //     item.longitudeE7
        // );
        const lat = (item.latitudeE7 / 10000000).toFixed(7);
        const lon = (item.longitudeE7 / 10000000).toFixed(7);
        if (lat == lattitude && lon == longitude) {
          Locations.push(item);
        }
      });
    });
    response.status(200).json({
      msg: "API chal gai bhai",
      data: Locations,
    });
  } catch (error) {
    console.error(error);
    response.status(500).json({ errors: [{ msg: error.message }] });
  }
});
app.listen(port, () => {
  console.log(`Express Server is started at PORT : ${port}`);
});
