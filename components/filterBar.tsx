import React, { useState, useEffect, useRef } from 'react';
import { RiCheckLine, RiCloseLine, RiFilterLine, RiFilterOffLine } from 'react-icons/ri';

import SortDropdown from './sortDropdown';
import Slider from './slider';
import { useClickOutside } from '../hooks';

import { Stuff, FilterCriteria } from '../types/types';

import styles from '../styles/FilterBar.module.scss';

interface Props {
    products: Stuff[];
    setProducts: React.Dispatch<React.SetStateAction<Stuff[]>>;
};

const FilterBar: React.FC<Props> = ({ products, setProducts }) => {
    const [isOpen, setOpen] = useState<boolean>(false);
    const [criteria, setCriteria] = useState<FilterCriteria | null>(null);
    const [filtered, setFiltered] = useState<Stuff[] | null>(null);
    
    const sliderMinVal = products.sort((a, b) => a.price - b.price)[0]?.price;
    const sliderMaxVal = products.sort((a, b) => b.price - a.price)[0]?.price;
    const checkboxStyle = (product) => `
        ${styles.checkbox} ${(criteria?.colors && criteria.colors.includes(product.color)) && styles.checked}
    `;

    const filterMenuRef: React.MutableRefObject<HTMLDivElement> | null = useRef(null);
    useClickOutside(filterMenuRef, isOpen, () => setOpen(false));

    const toggleFilterMenu = () => {
        setOpen((prev) => !prev);
    };

    const setCriteriaPrice = (price) => {
        setCriteria({
            ...criteria,
            price: price
        });
    };

    let reset = false;

    const addColor = (product) => {
        if (product) {
            if (criteria?.colors) {
                if (criteria.colors.includes(product.color)) {
                    setCriteria({
                        ...criteria,
                        colors: criteria.colors.filter(el => el !== product.color)
                    });
                }
                
                if (!criteria.colors.includes(product.color)) {
                    setCriteria({
                        ...criteria,
                        colors: [product.color, ...criteria.colors]
                    });
                }
            } else {
                setCriteria({
                    ...criteria,
                    colors: [product.color]
                })
            }
        }

        return;
    };

    const setFilter = (criteria) => {
        const filterArr = [];
        if (criteria) {
            products.forEach(product => {
                if (criteria?.name && product.name.toLowerCase().includes(criteria.name)) {
                    if (!filterArr.includes) {
                        filterArr.push(product);                        
                    }

                    return;
                }

                if (criteria?.price && (
                    (product.price >= criteria.price[0]) && (product.price <= criteria.price[1])
                )) {
                    if(!filterArr.includes(product)) {
                        if (criteria?.colors.includes(product.color)) {
                          filterArr.push(product);
                        }
                    }

                    return;
                }

                if (criteria?.colors && criteria.colors.includes(product.color)) {
                    if (!filterArr.includes(product)) {
                        if ((product.price >= criteria.price[0]) && (product.price <= criteria.price[1])) {
                            filterArr.push(product);
                        }
                    }
                    
                    return;
                }

            });

            filterArr.length && setFiltered(filterArr);
        }

        return;
    };

    useEffect(() => {
        setFiltered(products);
    }, []);

    useEffect(() => {
        if (!criteria) {
            setProducts(products);
            setFiltered(null);
        }
    }, [criteria]);

    useEffect(() => {
        if (filtered) {
            setProducts(filtered);
        }
    }, [filtered]);

    useEffect(() => {
        if (criteria && reset) {
            reset = false;
        }
    }, [criteria]);

    return (
        <div className={styles.container} ref={filterMenuRef}>
            <SortDropdown products={filtered ?? products} setProducts={setProducts}/>
            <div className={styles.openBtn} onClick={() => toggleFilterMenu()}>
                <RiFilterLine /> Filter
            </div>
            <div className={`${styles.filtersWrapper} ${isOpen ? styles.open : styles.close}`}>
                <div className={styles.btnsWrapper}>
                    <div className={styles.btn} onClick={() => setCriteria(null)}>
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
                <div className={styles.title}>Filter options</div>
                <div className={styles.filterList}>
                    <div className={styles.subtitle}>Price picker</div>
                    <Slider min={sliderMinVal} max={sliderMaxVal} setPrice={setCriteriaPrice} criteria={criteria} />
                        
                    <div className={styles.filterOption}>
                        <div className={styles.subtitle}>Color</div>
                        <div className={styles.itemList}>
                            {products.map((product, index) => product.color && (
                                <div key={index} className={styles.checkboxWrapper} onClick={() => addColor(product)}>
                                    <div className={checkboxStyle(product)}>
                                        <RiCheckLine />
                                    </div>
                                    <div className={styles.checkboxName}>{ product.color }</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className={styles.applyWrapper}>
                    <button className='btns' onClick={() => setFilter(criteria)}>Apply</button>
                </div>
            </div>
        </div>
    );
};

export default FilterBar;
