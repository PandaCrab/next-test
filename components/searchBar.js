import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { BiSearch } from 'react-icons/bi';

import { putSearch } from '../redux/ducks/search';

import styles from '../styles/SearchBar.module.scss';

const SearchBar = () => {
    const [isSearch, setSearch] = useState('');

    const dispatch = useDispatch();

    useEffect(() => {
        if (isSearch.length >= 3) {
            dispatch(putSearch(isSearch));
        }

        if (isSearch.length < 3) {
            dispatch(putSearch(''))
        }
    }, [isSearch]);

    return (
        <div className={styles.searchContainer}>
            <input
                className={styles.searchInput}
                name="isSearch"
                placeholder="What do we search for?"
                value={isSearch}
                onChange={({ target }) => setSearch(target.value)}
            />
            <button className={styles.searchBtn}>
                <BiSearch />
            </button>
        </div>
    );
};

export default SearchBar;
