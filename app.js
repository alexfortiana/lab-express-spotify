require('dotenv').config();

const { query } = require('express');
const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => 
        spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));
    

// Our routes go here:
app.get("/", (req, res, next) =>{
    res.render("home")
    
})

app.get("/artist-search", (req, res, next)=>{
    console.log(req.query.name)
    spotifyApi.searchArtists(req.query.name)
    .then((response)=>{
         console.log(response.body.artists.items.images)
        res.render("artist-search.hbs", {response: response.body.artists.items})
    })
    .catch((err) =>{
        console.log(err)
    })
})

app.get("/albums/:id", (req, res, next) => {
    spotifyApi.getArtistAlbums(req.params.id)
    .then((response) => {
        console.log(response.body.items)
        res.render("albums.hbs", {response: response.body.items})
    })
    .catch((err)=>{
        console.log(err)
    })
})
// app.get("/album/:id", (req, res, next) => {
//     spotifyApi.getAlbumTracks(req.params.id)
//     .then((response) => {
//         console.log(response)
//         // res.render("sound.hbs", {response: response.body.items})
//     })
//     .catch((err)=>{
//         console.log(err)
//     })
// })


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
