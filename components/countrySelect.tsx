import PropTypes from 'prop-types';
import React, { useState, useEffect, useRef } from 'react';
import { useClickOutside } from '../hooks';
import { SlArrowUp } from 'react-icons/sl';

import styles from '../styles/CountrySelect.module.scss';
import ErrorTooltip from './errorTooltip';

const CountrySelect = ({ value, setValue }) => {
    const [search, setSearch] = useState<string>('');
    const [isOpen, setOpen] = useState<boolean>(false);
    const [options, setOptions] = useState<string[] | []>([]);

    const selectRef: React.MutableRefObject<HTMLDivElement> = useRef(null);
    useClickOutside(selectRef, isOpen, () => setOpen(false));

    const optionsList = ['test', 'test1', 'test2', 'test3', 'test4'];

    const filteredList = (list) => {
        const filtered = list.filter((country) => country.toLowerCase().includes(search.toLowerCase()));

        return setOptions(filtered);
    };

    const toggleSelect = () => {
        setOpen((prev) => !prev);
    };

    useEffect(() => {
        setOptions(optionsList);
    }, []);

    useEffect(() => {
        filteredList(optionsList);
    }, [search]);

    return (
        <div className={styles.container} ref={selectRef}>
            <div className={styles.inputWrapper}>
                {isOpen ? (
                    <input
                        type="text"
                        className={styles.input}
                        onChange={({ target }) => setSearch(target.value)}

                    />
                ) : (
                    <input
                        readOnly
                        className={styles.input}
                        onClick={() => setOpen(true)}
                        value={value || 'Country'}
                    />  
                )}  
                <div 
                    className={isOpen ? `${styles.arrow} ${styles.up}` : `${styles.arrow} ${styles.down}`}
                    onClick={() => toggleSelect()}
                >
                    <SlArrowUp />
                </div>
            </div>
            <ul 
                className={
                    isOpen ? `${styles.optionsList} ${styles.open}` : `${styles.optionsList} ${styles.closed}`
                } 
                onTransitionEnd={() => setOpen(false)}
            >
                {options && options.map((item, index) => (
                    <li 
                        className={styles.option}
                        key={index}
                        onClick={() => setValue(item)}
                    >
                        {item}
                    </li>
                ))}
            </ul>
            <ErrorTooltip  />
        </div>
    );
};

CountrySelect.propTypes = {
    className: PropTypes.string
};

export default CountrySelect;
