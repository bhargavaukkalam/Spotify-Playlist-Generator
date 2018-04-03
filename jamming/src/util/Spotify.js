// const clientId = '53759af1d6444beb822b72e84720a6e4';
// const redirectUri = 'http://localhost:3000';
// const spotifyUrl = `https://accounts.spotify.com/authorize?response_type=token&scope=playlist-modify-public&client_id=${clientId}&redirect_uri=${redirectUri}`;


// let accessToken = undefined;
// let expiresIn = undefined;

// const Spotify = {
//   getAccessToken() {
//     if (accessToken) {
//       return accessToken;
//     }
//     const urlAccessToken = window.location.href.match(/access_token=([^&]*)/);
//     const urlExpiresIn = window.location.href.match(/expires_in=([^&]*)/);
//     if (urlAccessToken && urlExpiresIn) {
//       accessToken = urlAccessToken[1];
//       expiresIn = urlExpiresIn[1];
//       window.setTimeout(() => accessToken = '', expiresIn * 1000);
//       window.history.pushState('Access Token', null, '/');
//     } else {
//       window.location = spotifyUrl;
//     }
//   },

//   search(term) {
//     const searchUrl = `https://api.spotify.com/v1/search?type=track&q=${term.replace(' ', '%20')}`;
//     return fetch(searchUrl, {
//         headers: {
//           Authorization: `Bearer ${accessToken}`
//         }
//       })
//       .then(response => response.json())
//       .then(jsonResponse => {
//         if (!jsonResponse.tracks) return [];
//         return jsonResponse.tracks.items.map(track => {
//           return {
//             id: track.id,
//             name: track.name,
//             artist: track.artists[0].name,
//             album: track.album.name,
//             uri: track.uri
//           }
//         })
//       });
//   },

//   savePlaylist(name, trackUris) {
//     if (!name || !trackUris || trackUris.length === 0) return;
//     const userUrl = 'https://api.spotify.com/v1/me';
//     const headers = {
//       Authorization: `Bearer ${accessToken}`
//     };
//     let userId = undefined;
//     let playlistId = undefined;
//     fetch(userUrl, {
//       headers: headers 
//     })
//     .then(response => response.json())
//     .then(jsonResponse => userId = jsonResponse.id)
//     .then(() => {
//       const createPlaylistUrl = `https://api.spotify.com/v1/users/${userId}/playlists`;
//       fetch(createPlaylistUrl, {
//           method: 'POST',
//           headers: headers,
//           body: JSON.stringify({
//             name: name
//           })
//         })
//         .then(response => response.json())
//         .then(jsonResponse => playlistId = jsonResponse.id)
//         .then(() => {
//           const addPlaylistTracksUrl = `https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`;
//           fetch(addPlaylistTracksUrl, {
//             method: 'POST',
//             headers: headers,
//             body: JSON.stringify({
//               uris: trackUris
//             })
//           });
//         })
//     })
//   }
// };

// e

let accessToken='';
const clientID='e6eb4a40bad540e3acdaf6fa6619aa03';
// const redirectUri = 'http://SpotPlayGen.surge.sh';
const redirectUri = 'http://localhost:3000';
const Spotify={
  getAccessToken(){
    if(accessToken)
    {
      return accessToken;
    }
  const accessTokenId = window.location.href.match(/access_token=([^&]*)/);
  const expirationTime = window.location.href.match(/expires_in=([^&]*)/);

  if(accessTokenId && expirationTime){
    accessToken = accessTokenId[1];
    let expiresIn= Number(expirationTime[1]);

    window.setTimeout(() => accessToken = '', expiresIn * 1000);
    window.history.pushState('Access Token', null, '/');
    return accessToken;
  }
  else{
    window.location = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
    }
  },

  search(term) {
    const searchUrl = `https://api.spotify.com/v1/search?type=track&q=${term}`;
    Spotify.getAccessToken();
    return fetch(searchUrl, {
        headers: {
        Authorization: `Bearer ${accessToken}`
        }
      })
      .then(response => {
        return response.json()}).then(jsonResponse => {
        if (!jsonResponse.tracks) return [];
        return jsonResponse.tracks.items.map(track => {
          return {
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri
          }
        })
      });
  },


savePlaylist(playlistName, trackURIs) {
    if(!playlistName || !trackURIs) {
      return;
    }
    accessToken = Spotify.getAccessToken();
    let headers = {
       'Authorization': `Bearer ${accessToken}`,
    };

    let userID;
    return fetch('https://api.spotify.com/v1/me', { headers: headers }
  ).then(response => response.json()
  ).then(jsonResponse => {
    userID = jsonResponse.id;
    return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
      headers: headers,
      method: 'POST',
      body: JSON.stringify({ name: playlistName })
    }).then(response => response.json()
    ).then(jsonResponse => {
      let playlistID = jsonResponse.id;
      return fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`, {
        headers: headers,
        method: 'POST',
        body: JSON.stringify({ uris: trackURIs })
      });
    })
  });
  }
};


export default Spotify;