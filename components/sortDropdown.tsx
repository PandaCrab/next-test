import React, { useState, useEffect, useRef } from 'react';
import { SlArrowUp } from 'react-icons/sl';

import useSortProducts from '../hooks/sortProducts';
import { useClickOutside } from '../hooks';
import { criteria } from '../helpers/sortCriteria';

import { Stuff } from '../types/types';

import styles from '../styles/SortDropdown.module.scss';

interface Props {
    products: Stuff[];
    setProducts: React.Dispatch<React.SetStateAction<Stuff[]>>;
}

const SortDropdown: React.FC<Props> = ({ products, setProducts }) => {
    const [isOpen, setOpen] = useState<boolean>(false);
    const [sorted, setSortedBy] = useSortProducts(products);

    const ref: React.MutableRefObject<HTMLDivElement> | null= useRef(null);
    useClickOutside(ref, isOpen, () => setOpen(false));

    const toggleDropdown = () => {
        setOpen((prev) => !prev);
    };

    const itemClickHandler = (criterion) => {
        setSortedBy(criterion);
        setOpen(false);
    };

    useEffect(() => {
        if (sorted) {
            setProducts(sorted);
        }
    }, [sorted]);

    return (
        <div ref={ref} className={styles.container}>
            <div className={styles.dropdown} onClick={() => toggleDropdown()}>
                <div>Sort By</div>
                <div className={`${styles.arrow} ${!isOpen && styles.down}`}>
                    <SlArrowUp />
                </div>
            </div>
            <div className={`${styles.itemsWrapper} ${isOpen ? styles.open : styles.close}`}>
                {criteria.map((criterion, index) => (
                    <div
                        key={index} 
                        className={styles.item}
                        onClick={() => itemClickHandler(criterion)}
                    >
                        {criterion.replace(/-/, ' ')}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SortDropdown;
