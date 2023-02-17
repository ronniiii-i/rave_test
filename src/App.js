// App.js

import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, onValue, set } from "firebase/database";
import { useEffect, useState } from "react";
import SpotifyWebApi from "spotify-web-api-js";
import UserPage from "./UserPage";
import DJPage from "./DJPage.js";

const firebaseConfig = {
  apiKey: "AIzaSyBCnz98iJEYLtKPWMhrIIj2R3d-LF9mlPg",
  authDomain: "raverequest.firebaseapp.com",
  projectId: "raverequest",
  storageBucket: "raverequest.appspot.com",
  messagingSenderId: "100361895552",
  appId: "1:100361895552:web:a8c8b8a93ff1f4849bb065",
  measurementId: "G-EXV026XTNE",
  databaseURL: "https://raverequest-default-rtdb.firebaseio.com/",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const spotifyApi = new SpotifyWebApi();

function App() {
  const [requestedSongs, setRequestedSongs] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);


  useEffect(() => {
    // Set up Firebase listener to get song requests
    const requestsRef = ref(db, "requests");
    onValue(requestsRef, (snapshot) => {
      const requests = snapshot.val();
      if (requests) {
        const requestedSongs = Object.values(requests);
        setRequestedSongs(requestedSongs);
      } else {
        setRequestedSongs([]);
      }
    });

    // Authenticate with Spotify API
    spotifyApi.setAccessToken("YOUR_SPOTIFY_API_ACCESS_TOKEN");

    // Set up user authentication
    const email = prompt("Enter your email address:");
    setCurrentUser(email);
  }, []);

  const handleSongRequest = async (song) => {
    try {
      // Check if song has already been requested
      const existingSong = requestedSongs.find(
        (requestedSong) =>
          requestedSong.name === song.name && requestedSong.artists[0].name === song.artists[0].name
      );
      if (existingSong) {
        alert("This song has already been requested.");
        return;
      }

      // Add song request to database
      const newRequestRef = push(ref(db, "requests"));
      const newRequestId = newRequestRef.key;
      await set(newRequestRef, {
        id: song.id,
        name: song.name,
        artists: song.artists,
        userId: currentUser,
        timestamp: Date.now(),
      });

      // Update state
      setRequestedSongs([...requestedSongs, { id: song.id, name: song.name, artists: song.artists, requestId: newRequestId }]);

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      {currentUser ? (
        <UserPage onSongRequest={handleSongRequest} requestedSongs={requestedSongs} />
      ) : (
        <p>Please enter your email address.</p>
      )}
      {currentUser === "dj@example.com" && <DJPage requestedSongs={requestedSongs} />}
    </div>
  );
}

export default App;
