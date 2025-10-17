import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styles from './SearchResults.module.css';


type ResultItem = {
    id: string;
    author: string;
    local_url: string;
    distance?: number;
};


const SearchResult: React.FC = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('query') || '';
    const [results, setResults] = useState<ResultItem[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();


    useEffect(() => {
        if (!query) return;

        const fetchResults = async () => {
            setLoading(true);
            setError(null);

            try {
                console.log("Sending search query:", query);

                const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/pages/search`, {
                    method: 'POST',
                    headers: {
                        accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ query, top_k: 8 }),
                });

                console.log("Response status:", resp.status);

                if (!resp.ok) {
                    throw new Error(`Network response was not ok: ${resp.status}`);
                }

                const data = await resp.json();
                console.log("API returned:", data);

                if (Array.isArray(data)) {
                    setResults(data);
                } else if (data.results && Array.isArray(data.results)) {
                    setResults(data.results);
                } else {
                    console.warn("Unexpected API response shape:", data);
                    setResults([]);
                }
            } catch (err: any) {
                console.error("Error fetching search results:", err);
                setError(err.message || "Unknown error");
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [query]);

    const handleClick = (item: ResultItem) => {
        navigate(item.local_url);
    };

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <h2 className={styles.heading}>
                    Search results{query ? ` for "${query}"` : ''}
                </h2>

                {loading && <p className={styles.info}>Loading…</p>}
                {error && <p className={styles.error}>Error: {error}</p>}

                {!loading && !error && results.length === 0 && (
                    <p className={styles.empty}>No results found.</p>
                )}

                {!loading && results.length > 0 && (
                    <ul className={styles.list}>
                        {results.map((item) => (
                            <li
                                key={item.id}
                                className={styles.item}
                                onClick={() => handleClick(item)}
                                role="button"
                                tabIndex={0}
                                onKeyPress={(e) => e.key === 'Enter' && handleClick(item)}
                            >
                                {item.author}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );

};

// TODO: the SearchResult is extremely boring, will add more features later
export default SearchResult;
