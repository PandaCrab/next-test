import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { clearAlerts } from '../redux/ducks/alerts';

import styles from '../styles/PopupAlert.module.scss';

const PopupAlert = () => {
	const [success, setSuccess] = useState('');
	const [warning, setWarning] = useState('');
	const [error, setError] = useState('');

	const alert = useSelector((state) => state.alert);
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

		setTimeout(() => {
			dispatch(clearAlerts());
		}, 3000);
	}, [alert.success, alert.warning, alert.error]);

	return success ? (
		<div className={`${styles.alert} ${styles.success}`}>{success}</div>
	) : warning ? (
		<div className={`${styles.alert} ${styles.warning}`}>{warning}</div>
	) : (
		error && <div className={`${styles.alert} ${styles.error}`}>{error}</div>
	);
};

export default PopupAlert;
