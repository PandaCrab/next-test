import React, { useState, useEffect, useRef } from 'react';
import { useClickOutside } from '../hooks';
import { SlArrowUp } from 'react-icons/sl';

import { countryList } from '../helpers/countryList';
import ErrorTooltip from './errorTooltip';

import type { AddressInfo } from '../types/types';

import styles from '../styles/CountrySelect.module.scss';

interface Props {
    value: string;
    setValue: (arg0: string) => void;
    invalid: string;
    setInvalid: () => void;
};

const CountrySelect: React.FC<Props> = ({ value, setValue, invalid, setInvalid }) => {
    const [search, setSearch] = useState<string>('');
    const [isOpen, setOpen] = useState<boolean>(false);
    const [options, setOptions] = useState<string[] | []>([]);

    const selectRef: React.MutableRefObject<HTMLDivElement> = useRef(null);
    useClickOutside(selectRef, isOpen, () => setOpen(false));

    const inputStyles = `${styles.input} ${invalid && styles.invalid} ${isOpen && styles.search}`;

    const filteredList = (list) => {
        const filtered = list.filter((country) => country.toLowerCase().includes(search.toLowerCase()));

        return setOptions(filtered);
    };

    const onSelectHandler = (item) => {
        setValue(item);
        setOpen(false);
        setSearch(item);
        setInvalid();
    };

    const toggleSelect = () => {
        setOpen((prev) => !prev);
        setSearch('');
    };

    useEffect(() => {
        setOptions(countryList);
    }, []);

    useEffect(() => {
        filteredList(countryList);
    }, [search]);

    return (
        <div className={styles.container} ref={selectRef}>
                <input
                    readOnly={!isOpen}
                    type="text"
                    className={inputStyles}
                    onClick={() => setOpen(true)}
                    onChange={({ target }) => setSearch(target.value)}
                    placeholder={value || 'Country'}
                    value={isOpen ? search : (value || '')}
                />
                <div className={styles.arrowWrapper}> 
                    <div 
                        className={`${styles.arrow} ${isOpen ? styles.up : styles.down}`}
                        onClick={() => toggleSelect()}
                    >
                        <SlArrowUp />
                    </div>
                </div>
                <ul 
                    className={`${styles.optionsList} ${isOpen ? styles.open : styles.closed}`}
                >
                    {options && options.map((item, index) => (
                        <li 
                            className={styles.option}
                            key={index}
                            onClick={() => onSelectHandler(item)}
                        >
                            {item}
                        </li>
                    ))}
                </ul>
                {invalid && (
                    <ErrorTooltip message={invalid} />
                )}
        </div>
    );
};

export default CountrySelect;
