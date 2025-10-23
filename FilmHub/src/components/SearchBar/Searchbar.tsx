import { useId, useState } from "react";
import styles from "./Searchbar.module.css";

type SearchbarProps = {
  /** Función opcional que se llama cuando cambia el valor de búsqueda */
  onSearch?: (value: string) => void;
  /** Lista de sugerencias opcional */
  suggestions?: string[];
  /** Valor inicial opcional */
  value?: string;
};

export default function Searchbar({
  onSearch = () => {},          // ← función vacía por defecto
  suggestions = [],             // ← sugerencias opcionales
  value = "",                   // ← valor inicial opcional
}: SearchbarProps) {
  const [query, setQuery] = useState<string>(value);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const inputId = useId();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.currentTarget.value;
    setQuery(v);
    onSearch(v); // Llama a la función solo si fue pasada

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
        {/* etiqueta accesible (oculta visualmente si no hay estilo) */}
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
