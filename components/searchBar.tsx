import Image from 'next/image';
import PropTypes from 'prop-types';
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BiSearch } from 'react-icons/bi';

import { putSearch, deleteSearch } from '../redux/ducks/search';
import { data$ } from '../pages/api/api';
import { useClickOutside } from '../hooks';
import { storeStuff } from '../redux/ducks/stuff';

import type { Stuff } from '../types/types';

import styles from '../styles/SearchBar.module.scss';

const SearchBar = ({ isOpen, setOpen }) => {
    const [isSearch, setSearch] = useState<string>('');
    const [animation, setAnimation] = useState<boolean>(false);
    const [product, setProduct] = useState<Stuff[] | null>(null);

    const containerClass = `${styles.searchBarWrapper} ${animation && (isOpen ? styles.open : styles.close)}`;

    const inputRef: React.MutableRefObject<HTMLInputElement> = useRef();
    const searchRef: React.MutableRefObject<HTMLDivElement> | null = useRef(null);
    useClickOutside(searchRef, isOpen, () => setOpen(false));

    const dispatch = useDispatch();
    
    const catchSearchInput = useSelector((state: { search: { search: string } }) => state.search.search);
    const stuff = useSelector((state: { stuff: { stuff: Stuff[] } }) => state.stuff.stuff);

    const searchProducts = (text) => {
        if (text) {
            const filtered = stuff
                .filter((products) => Object.values(products).join('').toLowerCase().includes(text.toLowerCase()));

            setProduct(filtered);
        } else {
            setProduct(null);
        }
    };

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
        setSearch('');
        setProduct(null);

        dispatch(deleteSearch());
    };

    useEffect(() => {
        if (isOpen) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        searchProducts(catchSearchInput);
    }, [catchSearchInput]);

    useEffect(() => {
        data$.subscribe({
            next: async (result) => {
                try {
                    if (result) {
                        if (result.length) {
                            dispatch(storeStuff(result));
                        }
                    }
                } catch (err) {
                    console.log(err);
                }
            }
        });
    }, []);

    useEffect(() => {
        if (isSearch.length >= 3) {
            dispatch(putSearch(isSearch));
        }

        if (isSearch.length < 3) {
            dispatch(putSearch(''));
        }
    }, [isSearch]);
    return (
        <>
            <div className={containerClass} ref={searchRef} onAnimationEnd={(event) => animationEndHandler(event)}>
                <input
                    autoComplete='off'
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

            {isOpen && product && (
                <div className={styles.searchResults}>
                    {product?.length ? product.map(({ imgUrl, name, width, height }, index) => (
                        <div className={styles.item} key={index}>
                            <div className={styles.imageWrapper}>
                                <Image
                                    src={imgUrl}
                                    alt={name}
                                    width={width}
                                    height={height}
                                />
                            </div>
                            <div className={styles.productName}>{ name }</div>
                        </div>
                    )) : isSearch?.length >= 3 && (
                        <div className={`${styles.item} ${styles.empty}`}>
                            <div>Sorry, we don't have this</div>
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

SearchBar.propTypes = {
    isOpen: PropTypes.bool,
    setOpen: PropTypes.func,
};

export default SearchBar;
