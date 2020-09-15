require('dotenv').config();
const express = require('express');
const path = require('path');
const http = require('https');
const bodyParser = require('body-parser');

const app = express();
const key = process.env.API_KEY;

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/', (req, res) => {
  const { city } = req.body;
  const units = 'metric';
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${key}`;
  http.get(url, (call) => {
    if (call.statusCode === 200) {
      call.on('data', (data) => {
        const weatherData = JSON.parse(data);
        const { name: cityName } = weatherData;
        const { country } = weatherData.sys;
        const { temp: temperature, feels_like: feelsLike } = weatherData.main;
        const {
          description: weatherDescription,
          icon,
        } = weatherData.weather[0];
        const imageURL = `http://openweathermap.org/img/wn/${icon}@2x.png`;
        res.render('weather', {
          temperature,
          weatherDescription,
          imageURL,
          cityName,
          feelsLike,
          country,
        });
      });
    } else {
      res.redirect('/failure');
    }
  });
});

app.get('/failure', (req, res) => {
  res.render('failure');
});

app.post('/failure', (req, res) => {
  res.redirect('/');
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port ${process.env.PORT || 3000}`);
});
