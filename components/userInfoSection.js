import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { RiUser3Line, RiCheckFill, RiCloseLine } from 'react-icons/ri';
import { BsPencil } from 'react-icons/bs';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';

import { takeSomeProducts } from '../pages/api/api';

import styles from '../styles/UserInfoSection.module.scss';

const UserInfoSection = ({ updateInfo, view, setView, invalid }) => {
	const [descriptionHide, setDescriptionHide] = useState(true);

	const [likes, setLikes] = useState();
	const [ordersInBucket, setOrders] = useState();

	const [phone, setPhone] = useState({ phone: '' });

	const router = useRouter();

	const user = useSelector((state) => state.user.info);
	const order = useSelector((state) => state.order.userOrder);

	const catchLikedProducts = async (ids) => {
		const likedProducts = await takeSomeProducts(ids);

		if (likedProducts) {
			setLikes(likedProducts);
		}

		return;
	};

	useEffect(() => {
		if (user?.likes?.length) {
			catchLikedProducts(user.likes);
		} else {
			return;
		}
	}, [user]);

	useEffect(() => {
		if (order?.length) {
			setOrders(order);
		}
	}, [order]);

	return (
		<div className={styles.infoWrapper}>
			<div className={styles.userInfoWrapper}>
				<div className={styles.userProfileHeader}>
					<div className={styles.userPhotoWrapper}>{user.photo ? user.photo : <RiUser3Line />}</div>
					<div className={styles.usernameWrapper}>{user.username}</div>
				</div>
				<div className={styles.userPhoneWrapper}>
					{view.phoneChanging ? (
						<>
							<input
								className={
									invalid.path.phone
										? `${styles.phoneInput} ${styles.invalid}`
										: `${styles.phoneInput}`
								}
								name="phone"
								value={phone.phone}
								onChange={({ target }) => setPhone({ phone: target.value })}
								placeholder={invalid.path.phone ? invalid.path.phone : 'Enter your phone'}
							/>
							<div
								onClick={() => updateInfo(phone)}
								className={styles.changeBtn}
							>
								<RiCheckFill />
							</div>
							<div
								onClick={() =>
									setView({
										...view,
										phoneChanging: false,
									})
								}
								className={styles.changeBtn}
							>
								<RiCloseLine />
							</div>
						</>
					) : (
						<>
							<div>{user.phone}</div>
							<button
								onClick={() =>
									setView({
										...view,
										phoneChanging: true,
									})
								}
								className={styles.changeBtn}
							>
								<BsPencil />
							</button>
						</>
					)}
				</div>
				<div className={styles.addressWrapper}>
					{user.shippingAddress && Object.keys(user.shippingAddress).length ? (
						<>
							<div>
								<div className={styles.userAddressInfo}>
									{`${user.shippingAddress.street}, ${user.shippingAddress.city}, 
                                        ${user.shippingAddress.country}, ${user.shippingAddress.zip}`}
								</div>
							</div>
							<div>
								<button
									className="btns"
									onClick={() =>
										updateInfo({
											shippingAddress: {},
										})
									}
								>
									Clear
								</button>
								<button
									className="btns"
									onClick={() =>
										setView({
											...view,
											addressForm: true,
										})
									}
								>
									Change
								</button>
							</div>
						</>
					) : (
						<div className={styles.createAddressWrapper}>
							<div className={styles.descriptionWrapper}>
								<div>Do you want create autocomplete for shipping address?</div>
								<div
									onMouseEnter={() => setDescriptionHide(false)}
									onMouseLeave={() => setDescriptionHide(true)}
									onTouchStart={() => setDescriptionHide(false)}
									onTouchEnd={() => setDescriptionHide(true)}
									className={styles.descriptionOutput}
								>
									<b>i</b>
								</div>
								<div
									hidden={descriptionHide}
									className={styles.description}
								>
									That information need for autocomplete your shipping address, when you buying
									somthing. It`s saves Your time, and do orders more easy and fast to fill.
								</div>
							</div>
							<button
								className="btns"
								onClick={() =>
									setView({
										...view,
										addressForm: true,
									})
								}
							>
								Add address
							</button>
						</div>
					)}
				</div>
			</div>
			<div className={styles.subInfoWrapper}>
				<div className={styles.inBucket}>
					<div
						onClick={() =>
							setView({
								...view,
								inBucket: !view.inBucket,
							})
						}
						className={styles.itemsHeader}
					>
						Stuff in bucket
					</div>
					<div
						style={{
							display: view.inBucket ? 'flex' : 'none',
						}}
						className={styles.itemsWrapper}
					>
						{ordersInBucket ? (
							ordersInBucket.map((product) => (
								<div
									key={product._id}
									className={styles.items}
									onClick={() => router.push(`/shop/${product._id}`)}
								>
									<div className={styles.imageWrapper}>
										{product.imgUrl && (
											<Image
												src={product.imgUrl}
												alt={product.name}
												width={product.width ? `${product.width}px` : '150px'}
												height={product.height ? `${product.height}px` : '130px'}
											/>
										)}
									</div>
									<div>{product.name}</div>
									<div>${product.price}</div>
								</div>
							))
						) : (
							<div>Your shopping cart is empty</div>
						)}
					</div>
				</div>
				<div className={styles.likes}>
					<div
						onClick={() =>
							setView({
								...view,
								likes: !view.likes,
							})
						}
						className={styles.itemsHeader}
					>
						Your liked stuff
					</div>
					<div
						style={{ display: view.likes ? 'flex' : 'none' }}
						className={styles.itemsWrapper}
					>
						{likes ? (
							likes.map((product) => (
								<div
									key={product._id}
									className={styles.items}
									onClick={() => router.push(`/shop/${product._id}`)}
								>
									<div className={styles.imageWrapper}>
										{product.imgUrl && (
											<Image
												src={product.imgUrl}
												alt={product.name}
												width={product.width ? `${product.width}px` : '150px'}
												height={product.height ? `${product.height}px` : '130px'}
											/>
										)}
									</div>
									<div>{product.name}</div>
									<div>${product.price}</div>
								</div>
							))
						) : (
							<div>You didn`t liked anything yet</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default UserInfoSection;
