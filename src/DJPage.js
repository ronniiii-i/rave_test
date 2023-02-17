// DJPage.js

import SpotifyWebApi from "spotify-web-api-js";

const spotifyApi = new SpotifyWebApi();

function DJPage({ requestedSongs }) {
  const handleSongPlay = async (song) => {
    try {
      await spotifyApi.play({
        uris: [`spotify:track:${song.id}`],
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1>DJ Page</h1>
      <h2>Song Queue</h2>
      <ul>
        {requestedSongs.map((requestedSong) => (
          <li key={requestedSong.requestId}>
            <p>{requestedSong.name} - {requestedSong.artists[0].name}</p>
            <button onClick={() => handleSongPlay(requestedSong)}>Play Song</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DJPage;
