import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

import styles from '../styles/PaymentForm.module.scss';

const PaymentForm = () => {
	const [paymentType, setPaymentType] = useState('online');
	const [payment, setPayment] = useState({
		cardholder: '',
		cardNum: '',
		expiry: '',
		cvv: '',
	});

	const router = useRouter();

	const changeHandler = ({ target }) => {
		const { value, name } = target;

		setPayment({
			[name]: value,
		});
	};

	return (
		<div className={styles.container}>
			<div className={styles.checkboxesContainer}>
				<div className={styles.checkboxWrapper}>
					<div
						className={
							paymentType === 'online' ? `${styles.checkbox} ${styles.checked}` : `${styles.checkbox}`
						}
						onClick={() => setPaymentType('online')}
					/>
					<label>Online with card</label>
				</div>
				<div className={styles.checkboxWrapper}>
					<div
						className={
							paymentType === 'toCourier' ? `${styles.checkbox} ${styles.checked}` : `${styles.checkbox}`
						}
						onClick={() => setPaymentType('toCourier')}
					/>
					<label>With cash to courier</label>
				</div>
				<div className={styles.checkboxWrapper}>
					<div
						className={
							paymentType === 'onPostOffice'
								? `${styles.checkbox} ${styles.checked}`
								: `${styles.checkbox}`
						}
						onClick={() => setPaymentType('onPostOffice')}
					/>
					<label>With cash on post office</label>
				</div>
			</div>
			{paymentType === 'online' && (
				<div className={styles.PaymentForm}>
					<div className={styles.header}>Fill payment information</div>
					<input
						id="cardholder"
						className={styles.paymentInput}
						name="cardholder"
						placeholder="Enter cardholder name"
						value={payment.cardholder}
						onChange={(value) => changeHandler(value)}
					/>
					<input
						id="cardNum"
						className={styles.paymentInput}
						name="cardNum"
						placeholder="Enter card number"
						value={payment.cardNum}
						onChange={(value) => changeHandler(value)}
					/>
					<div className={styles.row}>
						<input
							id="expiry"
							className={styles.paymentInput}
							name="expiry"
							placeholder="MM/YY"
							value={payment.expiry}
							onChange={(value) => changeHandler(value)}
						/>
						<input
							id="cvv"
							className={styles.paymentInput}
							name="cvv"
							placeholder="Enter cvv code"
							value={payment.cvv}
							onChange={(value) => changeHandler(value)}
						/>
					</div>
				</div>
			)}
		</div>
	);
};

export default PaymentForm;
