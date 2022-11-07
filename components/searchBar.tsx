import PropTypes from 'prop-types';
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { BiSearch } from 'react-icons/bi';

import { putSearch } from '../redux/ducks/search';

import styles from '../styles/SearchBar.module.scss';
import { useClickOutside } from '../hooks';

const SearchBar = ({ isOpen, setOpen }) => {
    const [isSearch, setSearch] = useState<string>('');
    const [animation, setAnimation] = useState<boolean>(false);

    const containerClass = `${styles.searchContainer} ${animation && (isOpen ? styles.open : styles.close)}`;

    const inputRef: React.MutableRefObject<HTMLInputElement> = useRef();
    const searchRef: React.MutableRefObject<HTMLDivElement> | null = useRef(null);
    useClickOutside(searchRef, isOpen, () => setOpen(false));

    const dispatch = useDispatch();

    const animationEndHandler = ({ animationName }) => {
        if (animationName === 'search-open') {
            setOpen(true);
            setAnimation(true);
        }

        if (animationName === 'close-search') {
            setOpen(false);
            setAnimation(false);
        }
    };

    const toggleSearch = () => {
        setAnimation(true);

        setOpen(!isOpen);
    };

    useEffect(() => {
        if (isOpen) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        if (isSearch.length >= 3) {
            dispatch(putSearch(isSearch));
        }

        if (isSearch.length < 3) {
            dispatch(putSearch(''));
        }
    }, [isSearch]);

    return (
        <div className={containerClass} ref={searchRef} onAnimationEnd={(event) => animationEndHandler(event)}>
            <input
                ref={inputRef}
                hidden={!isOpen}
                className={styles.searchInput}
                name="isSearch"
                placeholder="What do we search for?"
                value={isSearch}
                onChange={({ target }) => setSearch(target.value)}
            />
            <button className={styles.searchBtn} onClick={() => toggleSearch()}>
                <BiSearch />
            </button>
        </div>
    );
};

SearchBar.propTypes = {
    isOpen: PropTypes.bool,
    setOpen: PropTypes.func,
};

export default SearchBar;
