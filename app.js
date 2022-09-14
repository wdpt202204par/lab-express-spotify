require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// Our routes go here:
app.get("/", (req, res, next) => {
  res.render("index");
});

app.get("/artist-search", (req, res, next) => {
  console.log(req.query.Artist); // "ezf"
  spotifyApi
    .searchArtists(req.query.Artist)
    .then((data) => {
      console.log(
        "The received data from the API: ",
        data.body.artists.items[0].images
      );
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      res.render("artist-search-results", {
        data: data,
      });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});
app.get("/albums/:artistId", (req, res, next) => {
  spotifyApi.getArtistAlbums(req.params.artistId).then(
    function (data) {
      console.log("Artist albums:", data.body);
      console.log("Images is:", data.body.items[0].images);
      res.render("albums", {
        data: data,
      });
    },
    function (err) {
      console.error(err);
    }
  );
});

app.get("/view-tracks/:albumId", (req, res, next) => {
  spotifyApi.getAlbumTracks(req.params.albumId, { limit: 5, offset: 1 }).then(
    function (data) {
      console.log("tracks data", data.body);
      console.log("artist object data ", data.body.items[0].artists);
      res.render("view-tracks", {
        // page to render to
        data: data,
      });
    },
    function (err) {
      console.log("Something went wrong!", err);
    }
  );
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
