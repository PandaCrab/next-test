import React from 'react';

import styles from '../styles/ErrorTooltip.module.scss'

const ErrorTooltip: React.FC<{ message: string | number }> = ({ message }) => {
    return (
        <div className={styles.container}>
            {message}
        </div>
    )
}

export default ErrorTooltip;
