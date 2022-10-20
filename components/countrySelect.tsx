import PropTypes from 'prop-types';
import React, { useState } from 'react';

import styles from '../styles/CountrySelect.module.scss';

const CountrySelect = ({ className }) => {
    const [isOpen, setOpen] = useState(false);
    const [selectedCountry, setCountry] = useState(null);

    const optionsList = ['test', 'test1', 'test2', 'test3', 'test4'];

    return (
        <div className={styles.Container}>
            <button
                className={className}
            >{selectedCountry || 'Country'}</button>
            <ul className={styles.optionsList}>
                {optionsList && optionsList.map((item, index) => (
                    <li 
                        className={styles.option}
                        key={index}
                    >
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    );
};

CountrySelect.propTypes = {
    className: PropTypes.string
};

export default CountrySelect;
