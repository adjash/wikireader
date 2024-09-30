import { useState, useEffect } from "react";
import SuggestionsList from "./SuggestionsList";

const SearchInput = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (searchTerm.trim()) {
      fetchSuggestions();
    } else {
      setSuggestions([]); // Clear suggestions if input is empty
    }
  }, [searchTerm]);

  const fetchSuggestions = async () => {
    try {
      const response = await fetch(
        `https://en.wikipedia.org/w/api.php?action=opensearch&search=${searchTerm}&limit=5&format=json&origin=*`
      );
      const data = await response.json();
      const suggestionResults = data[1];
      setSuggestions(suggestionResults);
    } catch (error) {
      console.error("Error fetching Wikipedia suggestions:", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onSearch(searchTerm);
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    onSearch(suggestion);
    setSuggestions([]);
  };

  const handleButtonClick = () => {
    onSearch(searchTerm);
    setSuggestions([]);
  };

  return (
    <div className="flex flex-col space-y-2 w-full max-w-lg mx-auto mt-8">
      <label htmlFor="search" className="text-sm font-semibold text-gray-700">
        Search Wikipedia
      </label>
      <input
        id="search"
        type="text"
        placeholder="Search Wikipedia..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyDown}
        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
      />
      <button
        onClick={handleButtonClick}
        className="px-4 py-2 mt-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
      >
        Search
      </button>
      <SuggestionsList
        suggestions={suggestions}
        onClickSuggestion={handleSuggestionClick}
      />
    </div>
  );
};

export default SearchInput;
