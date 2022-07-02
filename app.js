require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// setting the spotify-api goes here:

// Our routes go here:
app.get("/", (req, res, next) => {
  res.render("index", {
    title: "Home"
  })
})

app.get("/artist-search", (req, res, next) => {
  //console.log(req.query.artist)
  spotifyApi
    .searchArtists(req.query.artist)
    .then(data => {
      //console.log('The received data from the API: ', data.body);

      res.render("search-results", {
        title: `Result for ${req.query.artist}`,
        data: data.body.artists.items
      })
      //console.log('The received data from the API ITEMS: ', data.body.artists.items);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:artistId', (req, res, next) => {
  spotifyApi.getArtistAlbums(req.params.artistId)
  .then(
    function(data) {
      console.log('Artist albums', data.body);

      res.render("artist-search-results", {
        title: `Result for ${data.body.items[0].artists[0].name}`,
        data: data.body.items
      })
    })
  .catch(
    function(err) {
      console.error(err);
    }
  );
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
