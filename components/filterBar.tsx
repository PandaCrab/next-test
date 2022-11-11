import PropTypes from 'prop-types';
import React, { useState, useEffect, useRef } from 'react';
import { RiCloseLine, RiFilterLine, RiFilterOffLine } from 'react-icons/ri';

import { useClickOutside } from '../hooks';
import useSortProducts from '../hooks/sortProducts';

import styles from '../styles/FilterBar.module.scss';

const FilterBar = ({ products, setProducts }) => {
    const [isOpen, setOpen] = useState<boolean>(false);
    const [sorted, setSortedBy] = useSortProducts(products);
    

    const filterMenuRef: React.MutableRefObject<HTMLDivElement> | null = useRef(null);
    useClickOutside(filterMenuRef, isOpen, () => setOpen(false));

    const toggleFilterMenu = () => {
        setOpen((prev) => !prev);
    };

    const setCriteria = (criteria) => {
        setSortedBy(criteria);
    }

    useEffect(() => {
        setProducts(sorted);
    }, [sorted]);

    return (
        <div className={styles.container} ref={filterMenuRef}>
            <div className={styles.openBtn} onClick={() => toggleFilterMenu()}>
                <RiFilterLine /> Filter
            </div>
            <div className={`${styles.filtersWrapper} ${isOpen ? styles.open : styles.close}`}>
                <div className={styles.btnsWrapper}>
                    <div className={styles.btn} onClick={() => setSortedBy('')}>
                        <RiFilterOffLine /> 
                        <div className={styles.btnText}>Clear filter</div>
                    </div>
                    <div className={styles.btn} onClick={() => setOpen(false)}>
                        <div className={styles.btnText}>
                            Close
                        </div>
                        <RiCloseLine />
                    </div>
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
                    <div className={styles.subTitle}>Price filter</div>
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

FilterBar.propTypes = {
    products: PropTypes.array,
    setProducts: PropTypes.func
}

export default FilterBar;
