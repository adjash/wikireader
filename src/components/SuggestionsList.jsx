const SuggestionsList = ({ suggestions, onClickSuggestion }) => {
  if (!suggestions.length) return null;

  return (
    <ul className="bg-white border border-gray-200 rounded-md shadow-lg mt-2 max-h-60 overflow-auto">
      {suggestions.map((suggestion, index) => (
        <li
          key={index}
          onClick={() => onClickSuggestion(suggestion)}
          className="px-4 py-2 cursor-pointer hover:bg-gray-100 transition-colors"
        >
          {suggestion}
        </li>
      ))}
    </ul>
  );
};

export default SuggestionsList;
