import React, { useState } from 'react';
import styles from './SearchEngine.module.css';
import { useNavigate } from 'react-router-dom';

const SearchEngine: React.FC = () => {
    const [query, setQuery] = useState<string>('');
    const navigate = useNavigate();


    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && query.trim()) {
            navigate(`/search-results?query=${encodeURIComponent(query.trim())}`);
        }
    };


    return (
        <div className={styles.container}>
            <div className={styles.inner}>
                <h1 className={styles.title}>Search in Übermensch</h1>
                <div className={styles.inputWrapper}>
                    <input
                        id="search"
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Explore the ideas ..."
                        className={styles.searchInput}
                        aria-label="Search Übermensch"
                        autoComplete="off"
                    />
                </div>
            </div>
        </div>
    );
};


export default SearchEngine;