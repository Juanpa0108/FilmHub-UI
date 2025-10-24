/**
 * Searchbar.tsx
 *
 * A reusable and accessible search bar component with optional autocomplete suggestions.
 * It allows users to type queries, receive filtered suggestions, and trigger a callback
 * when the search value changes or a suggestion is selected.
 *
 * @module Searchbar
 */

import { useId, useState } from "react";
import styles from "./Searchbar.module.css";

/**
 * Props definition for the Searchbar component.
 */
type SearchbarProps = {
  /** Optional callback invoked whenever the search value changes */
  onSearch?: (value: string) => void;

  /** Optional list of suggestion strings displayed as the user types */
  suggestions?: string[];

  /** Optional initial input value */
  value?: string;
};

/**
 * Searchbar Component
 *
 * Renders a text input with optional suggestions that appear dynamically
 * as the user types. Each keystroke triggers the `onSearch` callback and
 * filters the suggestions list case-insensitively.
 *
 * Accessibility:
 * - Includes a hidden label for screen readers.
 * - Keyboard-friendly (suggestions can be clicked or navigated via Tab).
 *
 * @param {SearchbarProps} props - Component properties
 * @returns {JSX.Element} The rendered search bar element
 */
export default function Searchbar({
  onSearch = () => {}, // Default no-op callback
  suggestions = [],    // Optional autocomplete suggestions
  value = "",          // Optional initial input value
}: SearchbarProps) {
  // Controlled input state
  const [query, setQuery] = useState<string>(value);

  // Suggestions filtered based on the current query
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);

  // Unique input ID for accessibility
  const inputId = useId();

  /**
   * Handles user input in the search field.
   * Updates the query, triggers the `onSearch` callback,
   * and filters suggestions that include the typed text.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.currentTarget.value;
    setQuery(v);
    onSearch(v);

    const filtered = suggestions.filter((s) =>
      s.toLowerCase().includes(v.toLowerCase())
    );
    setFilteredSuggestions(filtered);
  };

  /**
   * Handles user selection of a suggestion from the list.
   * Updates the input value and clears the suggestion list.
   */
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

      {/* Suggestion list displayed when there are matches */}
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
