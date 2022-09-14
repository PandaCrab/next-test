import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

import styles from '../../styles/BillingForm.module.scss';

const BillingForm = () => {
	const [billingType, setBillingType] = useState('online');
	const [billing, setBilling] = useState({
		cardholder: '',
		cardNum: '',
		expiry: '',
		cvv: '',
	});

	const router = useRouter();

	const changeHandler = ({ target }) => {
		const { value, name } = target;

		setBilling({
			[name]: value,
		});
	};

	return (
		<div className={styles.container}>
			<div className={styles.checkboxesContaier}>
				<div className={styles.checkboxWrapper}>
					<div className={styles.checkbox} />
					<label>Online with card</label>
				</div>
				<div className={styles.checkboxWrapper}>
					<div className={styles.checkbox} />
					<label>With cash to courier</label>
				</div>
				<div className={styles.checkboxWrapper}>
					<div className={styles.checkbox} />
					<label>With cash on post office</label>
				</div>
			</div>
			<div className={styles.header}>Fill billing information</div>
			<input
				id="cardholder"
				className={styles.billingInput}
				name="cardholder"
				placeholder="Enter cardholder name"
				value={billing.cardholder}
				onChange={(value) => changeHandler(value)}
			/>
			<input
				id="cardNum"
				className={styles.billingInput}
				name="cardNum"
				placeholder="Enter card number"
				value={billing.cardNum}
				onChange={(value) => changeHandler(value)}
			/>
			<input
				id="expiry"
				className={styles.billingInput}
				name="expiry"
				placeholder="MM/YY"
				value={billing.expiry}
				onChange={(value) => changeHandler(value)}
			/>
			<input
				id="cvv"
				className={styles.billingInput}
				name="cvv"
				placeholder="Enter cvv code"
				value={billing.cvv}
				onChange={(value) => changeHandler(value)}
			/>
			<button className={styles.submitBtn}>Create order</button>
		</div>
	);
};

export default BillingForm;
