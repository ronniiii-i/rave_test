// UserPage.js

import { useState } from "react";
import SpotifyWebApi from "spotify-web-api-js";

const spotifyApi = new SpotifyWebApi();

function UserPage({ onSongRequest, requestedSongs }) {
  const [songSearch, setSongSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSongSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await spotifyApi.searchTracks(songSearch);
      setSearchResults(response.tracks.items);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1>User Page</h1>
      <form onSubmit={handleSongSearch}>
        <label htmlFor="songSearch">Search for a song:</label>
        <input
          type="text"
          id="songSearch"
          value={songSearch}
          onChange={(e) => setSongSearch(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      <ul>
        {searchResults.map((result) => (
          <li key={result.id}>
            <p>{result.name}</p>
            <p>{result.artists[0].name}</p>
            <button onClick={() => onSongRequest(result)}>Request Song</button>
          </li>
        ))}
      </ul>
      <h2>Requested Songs</h2>
      <ul>
        {requestedSongs.map((requestedSong) => (
          <li key={requestedSong.requestId}>
            <p>{requestedSong.name} - {requestedSong.artists[0].name}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserPage;
