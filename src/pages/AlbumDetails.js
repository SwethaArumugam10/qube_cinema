import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./Styles.css";

const AlbumDetails = () => {
  const { id } = useParams(); 
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAlbumDetails = async () => {
      try {
        const response = await fetch("http://localhost:5000/collectionDetails");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        // Extract album using ID
        if (data[id]) {
          setAlbum(data[id]);
        } else {
          setError("Album not found.");
        }
      } catch (err) {
        setError(`Error fetching album details: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbumDetails();
  }, [id]);

  
  const formatTotalDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes} minutes ${remainingSeconds} seconds`;
  };

  
  const formatDuration = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hrs).padStart(2, "0")}.${String(mins).padStart(2, "0")}.${String(secs).padStart(2, "0")}`;
  };

  if (loading) return <h2>Loading...</h2>;
  if (error) return <h2 style={{ color: "red" }}>{error}</h2>;

  // Calculate total duration
  const totalDurationInSeconds = album.songs?.reduce(
    (acc, song) => acc + (song.durationInSeconds || 0),
    0
  );

  return (
    <div className="album-details-container">
      
      <div className="breadcrumb">
        <Link to="/">Overview</Link> &gt; <span>{album.name}</span>
      </div>  
      <div className="collection-header">
        <h1>{album.name}</h1>
      </div>
      <div className="collection-details">
        <div className="detail-item">
          <p><strong>Artist</strong></p>
          <p>{album.artist}</p>
        </div>
        <div className="detail-item">
          <p><strong>Type</strong></p>
          <p>{album.type}</p>
        </div>
        <div className="detail-item">
          <p><strong>Song Count</strong></p>
          <p>{album.songCount}</p>
        </div>
        <div className="detail-item">
  <p><strong>Total Size</strong></p>
  <p>{(album.songs?.reduce((acc, song) => acc + (song.sizeInBytes || 0), 0) / (1024 * 1024)).toFixed(2)} MB</p>
</div>
        <div className="detail-item">
          <p><strong>Total Duration</strong></p>
          <p>{formatTotalDuration(totalDurationInSeconds)}</p>
        </div>
        <div className="detail-item">
  <p><strong>Released On</strong></p>
  <p>{new Date(album.releasedOn).toLocaleDateString('en-GB', {day: '2-digit',month: 'short',year: 'numeric' }).replace(' ', '')} </p>
  </div>
  </div>
      {/* Songs Table */}
      <div className="songs-table-container">
  <div className="songs-table-wrapper"> 
    <table className="collections-table">
      <thead>
        <tr>
          <th>Song</th>
          <th>Performers</th>
          <th>Duration</th>
          <th>Size </th>
        </tr>
      </thead>
      <tbody>
        {Array.isArray(album.songs) && album.songs.length > 0 ? (
          album.songs.map((song, index) => (
            <tr key={index}>
              <td>{song.title}</td>
              <td>{Array.isArray(song.performers) ? song.performers.join(", ") : "N/A"}</td>
              <td>{formatDuration(song.durationInSeconds || 0)}</td>
              <td>{song.sizeInBytes ? (song.sizeInBytes / (1024 * 1024)).toFixed(2) : "N/A"} MB</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="4" style={{ textAlign: "center", color: "gray" }}>
              No songs available
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</div>
</div>
  );
};

export default AlbumDetails;
