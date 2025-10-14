import React, { useState } from "react";
import styles from "./Searchbar.module.css";

const Searchbar = ({ onSearch, suggestions = [], value = "" }) => {
  const [query, setQuery] = useState(value);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);

    const filtered = suggestions.filter((s) =>
      s.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredSuggestions(filtered);
  };

  const handleSelectSuggestion = (value) => {
    setQuery(value);
    onSearch(value);
    setFilteredSuggestions([]);
  };

  return (
    <div className={styles.wrapper}>
      <form className={styles.searchBar} onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search movies..."
          value={query}
          onChange={handleChange}
        />
      </form>
      {filteredSuggestions.length > 0 && (
        <ul className={styles.suggestionsList} data-testid="suggestion-list">
          {filteredSuggestions.map((s, index) => (
            <li
              key={index}
              className={styles.suggestionItem}
              data-testid={`suggestion-${index}`}
              onClick={() => handleSelectSuggestion(s)}
            >
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Searchbar;
