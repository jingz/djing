const express = require('express')
const app = express()
const port = 3000


// X, 5, 9, 15, 23, Y, Z  - Please create a new function for finding X, Y, Z value
const finding = () => {
  let exampleList = ['X', '5', '9', '15', '23', 'Y', 'Z'];
  return exampleList.filter(c => /[A-Z]/.test(c));
}
 
app.get('/', (req, res) => res.send(`
<html>
  <head>
    <title>SCG ASSIGNMENT</title>
  </head>
  <body>
    <h1>SCG ASSIGNMENT</h1>

    <ul>
      <li><a href='/scg'>New SCG Controller and return finding X,Y,Z</a></li>
      <li><a href='/places'>Find Restaurant place at bangsu</a></li>
    </ul>
  </body>
</html>
`))

// new SCG controllers
app.get('/scg', (req, res) => res.send('Hello World! and Finding funtion result is :' + finding()))


const https = require('https');

// setting variables
const API_KEY = 'AIzaSyA_te6q-BbyxOtW7TUvwTOCzKMwoywskiE'
const BANGSU_LOCATION = '13.8235283,100.5081204'
const SEARCH_RESTAURANT_URI = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${BANGSU_LOCATION}&radius=500&types=restaurant&fields=types,photos,formatted_address,name,rating,opening_hours,geometry&key=${API_KEY}`

const searchPlaces = () => {
  return new Promise((resolve, reject) => {
    https.get(SEARCH_RESTAURANT_URI, (resp) => {
      console.log('making a request ....');

      let output = ''
      resp.on('data', (d) => {
        output += d;
      });

      resp.on('end', () => {
        console.log('request completed')
        resolve(JSON.parse(output));
      });

    }).on('error', (e) => {
      reject(e);
    });
  });
}

app.get('/places', async (req, res) => {
  const places = await searchPlaces()
  res.json(places);
})

// open server
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
