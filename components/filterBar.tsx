import React, { useState, useEffect, useRef } from 'react';
import { RiFilterLine, RiFilterOffLine } from 'react-icons/ri';

import { useClickOutside } from '../hooks';
import useSortProducts from '../hooks/sortProducts';

import styles from '../styles/FilterBar.module.scss';

const FilterBar = ({ products, setProducts, sortBy }) => {
    const [isOpen, setOpen] = useState<boolean>(false);
    const [animation, setAnimation] = useState<boolean>(false);

    const filterMenuRef: React.MutableRefObject<HTMLDivElement> | null = useRef(null);
    useClickOutside(filterMenuRef, isOpen, () => setOpen(false));

    const toggleFilterMenu = () => {
        setAnimation(true);

        setOpen((prev) => !prev);
    };

    const setCriteria = (criteria) => {
        sortBy(criteria);

        // setProducts(sorted);
    }

    return (
        <div className={styles.container} ref={filterMenuRef}>
            <div className={styles.openBtn} onClick={() => toggleFilterMenu()}>
                <RiFilterLine /> Filter
            </div>
            <div className={`${styles.filtersWrapper} ${isOpen ? styles.open : styles.close}`}>
                <div onClick={() => sortBy('')}>
                    <RiFilterOffLine /> Clear filter
                </div>
                <div className={styles.title}>Filter criteria</div>
                <div className={styles.filterList}>
                    <div
                        className={styles.filterCriteria}
                        onClick={() => setCriteria('quantity')}
                    >
                        quantity
                    </div>
                    <div
                        className={styles.filterCriteria}
                        onClick={() => setCriteria('rating')}
                    >
                        rating
                    </div>
                    <div
                        className={styles.filterCriteria}
                        onClick={() => setCriteria('price')}
                    >
                        price
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilterBar;
