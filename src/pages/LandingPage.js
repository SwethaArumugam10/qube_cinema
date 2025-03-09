import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Styles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass , faChevronDown } from "@fortawesome/free-solid-svg-icons";


const LandingPage = () => {
  const [collections, setCollections] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/collections")
      .then((response) => response.json())
      .then((data) => setCollections(data))
      .catch((error) => console.error("Error fetching collections:", error));
  }, []);

  const formatDuration = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const filteredCollections = collections.filter((collection) => {
    const collectionType = collection.type.toLowerCase();
    const matchesSearch =
      searchTerm === "" ||
      collection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      collection.artist.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(collectionType);
    return matchesSearch && matchesType;
  });

  const handleTypeChange = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  // Function to toggle dropdown open/close
  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  return (
    <div className="landing-container">
      <header className="header-container">
        <h1>Overview</h1>
      </header>

      <main className="content-container">
        <section className="search-filter-container">
  <div className="search-box">
    <input
      type="text"
      placeholder="Search"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
    <span className="search-icon">
      <FontAwesomeIcon icon={faMagnifyingGlass} />
    </span>
  </div>
{/* Fixed Dropdown */}
<div className={`filter-dropdown ${isDropdownOpen ? "active" : ""}`}>
  <button className="filter-button" onClick={() => toggleDropdown(true)}>
    Type {selectedTypes.length > 0 ? `(${selectedTypes.length})` : ""}
    <FontAwesomeIcon icon={faChevronDown} style={{ marginLeft: "8px" }} />
  </button>

  {isDropdownOpen && (
    <div className="filter-menu">
      {["EP", "ALBUM", "SINGLE"].map((type) => (
        <label key={type}>
          <input
            type="checkbox"
            checked={selectedTypes.includes(type.toLowerCase())}
            onChange={() => {
              handleTypeChange(type.toLowerCase());
              setIsDropdownOpen(false); 
            }}
          />
          {type}
        </label>
      ))}
    </div>
  )}
</div>
 </section>
        <table className="collections-table">
          <thead>
            <tr>
              <th>Collection Name</th>
              <th>Type</th>
              <th>Song Count</th>
              <th>Duration</th>
              <th>Size</th>
              <th>Released On</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredCollections.length > 0 ? (
              filteredCollections.map((collection) => (
                <tr key={collection.id}>
                  <td>
                    <strong>{collection.name}</strong>
                    <br />
                    <span className="artist-text">{collection.artist}</span>
                  </td>
                  <td>{collection.type}</td>
                  <td>{collection.songCount}</td>
                  <td>{formatDuration(collection.durationInSeconds)}</td>
                  <td>{collection.sizeInBytes ? (collection.sizeInBytes / (1024 * 1024)).toFixed(2) : "N/A"} MB</td>
                  <td>{new Date(collection.releasedOn).toLocaleString('en-GB', {day: '2-digit', month: 'short', year: 'numeric',  hour: '2-digit',  minute: '2-digit', hour12: true }).replace(',','')}</td>
                  <td>
                    <Link to={`/album/${collection.id}`} className="view-details">
                      <span className="eye-icon">👁</span> View Details
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-results">
                  No results found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default LandingPage;