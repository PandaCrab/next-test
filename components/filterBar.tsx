import React, { useState, useEffect, useRef } from 'react';
import { RiCloseLine, RiFilterLine, RiFilterOffLine } from 'react-icons/ri';

import { useClickOutside } from '../hooks';

import styles from '../styles/FilterBar.module.scss';
import { Stuff } from '../types/types';
import Slider from './slider';
import SortDropdown from './sortDropdown';

interface CriteriaState {
    name?: string;
    price?: number[];
    colors?: string[];
};

interface Props {
    products: Stuff[];
    setProducts: React.Dispatch<React.SetStateAction<Stuff[]>>;
};

const FilterBar: React.FC<Props> = ({ products, setProducts }) => {
    const [isOpen, setOpen] = useState<boolean>(false);
    const [criteria, setCriteria] = useState<CriteriaState | null>(null);
    
    const sliderMinVal = products.sort((a, b) => a.price - b.price)[0]?.price;
    const sliderMaxVal = products.sort((a, b) => b.price - a.price)[0]?.price;

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

    const addColor = (product) => {
        if (product) {
            if (criteria.colors) {
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
    };

    const setFilter = (criteria) => {
        const filterArr = [];
        if (criteria) {
            products.forEach(product => {
                if (criteria?.name && product.name.toLowerCase().includes(criteria.name)) {
                    if (!filterArr.filter(el => el === product).length) {
                        filterArr.push(product);                        
                    }

                    console.log('name-no match');
                    return;
                }

                if (criteria?.price && (
                    (product.price >=criteria.price[0]) && (product.price <= criteria.price[1])
                )) {
                    if(!filterArr.filter(el => el._id === product._id).length) {
                        filterArr.push(product);
                    }

                    console.log('price - no match');
                    return;
                }

                if (criteria?.colors && criteria.colors.includes(product.color)) {
                    if (!filterArr.includes(product)) {
                        filterArr.push(product);
                    }
                    
                    console.log('color - no match')
                    return;
                }

            });

            filterArr.length && setProducts(filterArr);
        }

        return;
    };
console.log(criteria)
    return (
        <div className={styles.container} ref={filterMenuRef}>
            <SortDropdown products={products} setProducts={setProducts} />
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
                <div className={styles.title}>Filter criteria</div>
                <div className={styles.filterList}>
                    <div className={styles.filterOption}>
                        <div className={styles.subTitle}>Price picker</div>
                        <Slider min={sliderMinVal} max={sliderMaxVal} setPrice={setCriteriaPrice}/>
                    </div>
                    <div className={styles.filterOption}>
                        <div className={styles.subtitle}>Color</div>
                        <div className={styles.itemList}>
                            {products.map((product, index) => (
                                <div key={index} className={styles.checkboxWrapper}>
                                    <input
                                        type="checkbox"
                                        className={styles.checkbox}
                                        checked={criteria?.colors && criteria.colors.includes(product.color)}
                                        onClick={() => addColor(product)}
                                    />
                                    <div className={styles.checkboxName}>{ product.color && product.color }</div>
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
