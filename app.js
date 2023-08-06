require('dotenv').config();

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
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

app.get('/', (req, res, next) => {
    res.render('index', { title: 'Spotify Search' });
});

app.get('/artist-search', (req, res, next) => {
    const searchQuery = req.query.artistName;

    spotifyApi.searchArtists(searchQuery)
        .then(data => {
            res.render('artist-search-results', { title: 'Results', searchData: data.body.artists.items });
        })
        .catch(err => console.log('An error occurred while searching artists:', err));
});

app.get('/albums/:artistId', (req, res, next) => {
    const artistId = req.params.artistId;

    spotifyApi.getArtistAlbums(artistId)
        .then(data => {
            const albumsData = data.body.items;
            res.render('albums', { title: 'Albums', artistId: artistId, albums: albumsData });
        })
        .catch(err => {
            console.log('An error occurred while getting albums:', err);
            res.redirect('/error');
        });
});

app.get('/tracks/:albumId', (req, res, next) => {
    const albumId = req.params.albumId;

    spotifyApi.getAlbumTracks(albumId)
        .then(data => {
            const tracksData = data.body.items;
            res.render('tracks', { title: 'Tracks', albumId: albumId, tracks: tracksData });
        })
        .catch(err => {
            console.log('An error occurred while getting album tracks:', err);
            res.redirect('/error');
        });
});

app.listen(3000, () => console.log('My Spotify project is running on port 3000 🎧 🥁 🎸 🔊'));