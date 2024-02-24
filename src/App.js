// MultiSelectAutocomplete.js
import React, { useState, useEffect, useRef, useCallback } from "react";
import "./MultiSelectAutocomplete.css";

const MultiSelectAutocomplete = () => {
  const [query, setQuery] = useState("");
  const [characters, setCharacters] = useState([]);
  const [selectedCharacters, setSelectedCharacters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const fetchCharacters = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `https://rickandmortyapi.com/api/character/?name=${query}`
      );
      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setCharacters(data.results);
      }
    } catch (error) {
      setError("An error occurred while fetching characters.");
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    if (query.trim() !== "") {
      fetchCharacters();
    } else {
      setCharacters([]);
    }
  }, [query, fetchCharacters]);

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSelect = (character) => {
    setQuery("");
    setSelectedCharacters([...selectedCharacters, character]);
  };

  const handleRemove = (character) => {
    const updatedCharacters = selectedCharacters.filter(
      (char) => char.id !== character.id
    );
    setSelectedCharacters(updatedCharacters);
  };

  const highlight = (text) => {
    const lowerCasedQuery = query.toLowerCase();
    const lowerCasedText = text.toLowerCase();
    const index = lowerCasedText.indexOf(lowerCasedQuery);

    if (index !== -1) {
      const before = text.substring(0, index);
      const match = text.substring(index, index + query.length);
      const after = text.substring(index + query.length);

      return (
        <>
          {before}
          <strong>{match}</strong>
          {after}
        </>
      );
    }

    return text;
  };

  return (
    <div className="multi-select-autocomplete">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        ref={inputRef}
        placeholder="Search characters..."
      />
      {loading && <div className="loading">Loading...</div>}
      {error && <div className="error">Error: {error}</div>}
      <div className="suggestions">
        {characters.map((character) => (
          <div
            key={character.id}
            className="suggestion-item"
            onClick={() => handleSelect(character)}
          >
            <div className="suggestion-info">
              <img
                src={character.image}
                alt={character.name}
                className="suggestion-image"
              />
              <div>
                <div>{highlight(character.name)}</div>
                <div>{`Episodes: ${character.episode.length}`}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="selected-characters">
        {selectedCharacters.map((character) => (
          <div
            key={character.id}
            className="selected-character"
            onClick={() => handleRemove(character)}
          >
            <img
              src={character.image}
              alt={character.name}
              className="selected-character-image"
            />
            <div>
              <div>{highlight(character.name)}</div>
              <div>{`Episodes: ${character.episode.length}`}</div>
            </div>
          </div>
        ))}
        {/* Seçili karakter yoksa placeholder göster */}
        {selectedCharacters.length === 0 && (
          <div className="selected-character-placeholder">
            Select characters to see details.
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiSelectAutocomplete;
