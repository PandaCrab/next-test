import PropTypes from 'prop-types'
import React from 'react';

import styles from '../styles/ErrorTooltip.module.scss'

const ErrorTooltip = ({ message }) => {
    return (
        <div className={styles.container}>
            {message}
        </div>
    )
}

ErrorTooltip.propTypes = {
    message: PropTypes.string,
};

export default ErrorTooltip;
