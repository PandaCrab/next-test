import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { RiSettings4Line } from 'react-icons/ri';

import LoginPage from '../login';
import { updateUserInfo } from '../api/api';
import { getInfo } from '../../redux/ducks/user';
import { catchSuccess, catchError } from '../../redux/ducks/alerts';
import { addressSchema, phoneSchema } from '../../helpers/validation';
import { UserInfoSection, DelitionAccount, AddressForm } from '../../components';

import styles from '../../styles/AccountPage.module.scss';

const AccountPage = () => {
	const [loged, setLoged] = useState(false);
	const [invalid, setInvalid] = useState({
		path: {},
		isValid: false,
	});
	const [view, setView] = useState({
		inBucket: false,
		likes: false,
		addressForm: false,
		phoneChanging: false,
		settings: false,
		agreeDeletion: false,
		confirmPassword: false,
	});

	const settingsRef = useRef();

	const router = useRouter();
	const dispatch = useDispatch();

	const token = useSelector((state) => state.user.token);
	const user = useSelector((state) => state.user.info);

	const updateInfo = async (info) => {
		const id = router.query.userAccount;

		if (info.shippingAddress && Object.keys(info.shippingAddress).length === 0) {
			const res = await updateUserInfo(id, info);

			dispatch(catchSuccess(res.message));
			dispatch(getInfo(res.updated));
		}
		console.log(info);
		if (info) {
			if (info.phone) {
				await phoneSchema
					.validate(info)
					.then(async (value) => {
						if (value) {
							const res = await updateUserInfo(id, info);

							if (res.message) {
								dispatch(catchSuccess(res.message));
								dispatch(getInfo(res.updated));

								setPhone({ phone: '' });
								setView({
									...view,
									phoneChanging: false,
								});
							}

							if (res.error) {
								dispatch(catchError(res.error));
							}
						}
					})
					.catch((error) => {
						const validationError = {};

						error.inner.forEach((err) => {
							if (err.path) {
								validationError[err.path] = err.message;
							}
						});

						setInvalid({
							path: validationError,
							isValid: false,
						});
					});
			}

			if (info.shippingAddress) {
				await addressSchema
					.validate(info, { abortEarly: false })
					.then(async (value) => {
						if (value) {
							const res = await updateUserInfo(id, info);

							if (res.message) {
								dispatch(catchSuccess(res.message));
								dispatch(getInfo(res.updated));

								setAddressForm({
									street: '',
									city: '',
									country: '',
									zip: '',
								});

								setView({
									...view,
									addressForm: false,
								});

								setInvalid({
									path: {},
									isValid: true,
								});
							}

							if (res.error) {
								dispatch(catchError(res.error));
							}
						}
					})
					.catch((error) => {
						const validationError = {};

						error.inner.forEach((err) => {
							if (err.path) {
								validationError[err.path] = err.message;
							}
						});

						setInvalid({
							path: validationError,
							isValid: false,
						});
					});
			}
		}

		return;
	};

	const clickOutsideSettings = (event) => {
		if (!settingsRef.current.contains(event.target)) {
			setView({
				...view,
				settings: false,
			});
		}
	};

	useEffect(() => {
		if (view.settings) {
			document.addEventListener('click', clickOutsideSettings);
		}

		return () => {
			document.removeEventListener('click', clickOutsideSettings);
		};
	}, [view.settings]);

	useEffect(() => {
		if (token) {
			setLoged(true);
		}

		if (!token) {
			setLoged(false);
		}
	}, [token]);

	return loged ? (
		user && (
			<div className={styles.accountContainer}>
				<div className={styles.headerWrapper}>
					<div className={styles.greeting}>My account</div>
					{user?.admin && <div>Admin</div>}
					<div
						className={styles.settingsWrapper}
						ref={settingsRef}
					>
						<button
							className={styles.settingsBtn}
							onClick={() =>
								setView({
									...view,
									settings: !view.settings,
								})
							}
						>
							<RiSettings4Line />
						</button>
						{view.settings && (
							<div className={styles.settings}>
								<div
									className={styles.settingsItem}
									onClick={() =>
										setView({
											...view,
											agreeDeletion: true,
											settings: false,
										})
									}
								>
									Delete account
								</div>
							</div>
						)}
					</div>
				</div>
				{view.agreeDeletion && (
					<DelitionAccount
						view={view}
						setView={setView}
					/>
				)}
				{view.addressForm && (
					<AddressForm
						updateInfo={updateInfo}
						view={view}
						setView={setView}
						invalid={invalid}
					/>
				)}
				<UserInfoSection
					updateInfo={updateInfo}
					view={view}
					setView={setView}
					invalid={invalid}
				/>
			</div>
		)
	) : (
		<LoginPage />
	);
};

export default AccountPage;
