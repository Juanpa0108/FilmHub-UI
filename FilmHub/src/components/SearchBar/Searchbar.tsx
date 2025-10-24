import { useId, useState } from "react";
import styles from "./Searchbar.module.css";

type SearchbarProps = {
  /** Optional callback invoked whenever the search value changes */
  onSearch?: (value: string) => void;
  /** Optional list of suggestion strings */
  suggestions?: string[];
  /** Optional initial value */
  value?: string;
};

export default function Searchbar({
  onSearch = () => {},          // default no-op callback
  suggestions = [],             // optional suggestions
  value = "",                   // optional initial value
}: SearchbarProps) {
  const [query, setQuery] = useState<string>(value);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const inputId = useId();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.currentTarget.value;
    setQuery(v);
  onSearch(v); // notify parent about the new value

    const filtered = suggestions.filter((s) =>
      s.toLowerCase().includes(v.toLowerCase())
    );
    setFilteredSuggestions(filtered);
  };

  const handleSelectSuggestion = (v: string) => {
    setQuery(v);
    onSearch(v);
    setFilteredSuggestions([]);
  };

  return (
    <div className={styles.wrapper}>
      <form
        className={styles.searchBar}
        role="search"
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => e.preventDefault()}
      >
  {/* Accessible label (visually hidden via CSS utility) */}
        <label htmlFor={inputId} className={styles.visuallyHidden}>
          Search movies
        </label>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search movies..."
          value={query}
          onChange={handleChange}
          id={inputId}
          name="search"
          autoComplete="search"
          aria-label="Search movies"
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
}
