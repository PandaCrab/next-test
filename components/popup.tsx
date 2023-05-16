import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { string } from 'yup';

import { clearAlerts } from '../redux/ducks/alerts';

import styles from '../styles/PopupAlert.module.scss';

interface AlertReduxState {
    alert: {
        success?: string;
        warning?: string;
        error?: string;
    };
};

const PopupAlert: React.FC = () => {
    const [success, setSuccess] = useState<string>('');
    const [warning, setWarning] = useState<string>('');
    const [error, setError] = useState<string>('');

    const alert = useSelector((state: AlertReduxState) => state.alert);
    const dispatch = useDispatch();

    useEffect(() => {
        if (alert.success) {
            setSuccess(alert.success);
            setTimeout(() => setSuccess(''), 3000);
        }

        if (alert.warning) {
            setWarning(alert.warning);
            setTimeout(() => setWarning(''), 3000);
        }

        if (alert.error) {
            setError(alert.error);
            setTimeout(() => setError(''), 3000);
        }
    }, [alert.success, alert.warning, alert.error]);

    if (success) {
        return <div className={`${styles.alert} ${styles.success}`}>{success}</div>;
    }

    if (warning) {
        return <div className={`${styles.alert} ${styles.warning}`}>{warning}</div>;
    }

    if (error) {
        return <div className={`${styles.alert} ${styles.error}`}>{error}</div>;
    }
};

export default PopupAlert;
