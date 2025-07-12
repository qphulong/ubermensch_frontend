import React, { useState } from 'react';
import styles from './SearchEngine.module.css';

const SearchEngine: React.FC = () => {
  const [query, setQuery] = useState<string>('');

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim()) {
      console.log(`Searching for: ${query}`);
      // Placeholder for search API call
      // Example: const response = await fetch(`https://api.example.com/search?q=${query}`);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Search in Übermensch</h1>
      <div className={styles.inputWrapper}>
        <input
          type="text"
          value={query}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Explore the universe..."
          className={styles.searchInput}
        />
      </div>
    </div>
  );
};

export default SearchEngine;