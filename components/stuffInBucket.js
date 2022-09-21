import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

import styles from '../styles/StuffInBucket.module.scss';

const StuffinBucket = ({ view, setView }) => {
	const [ordersInBucket, setOrders] = useState();

	const router = useRouter();

	const order = useSelector((state) => state.order.clientOrder);

	useEffect(() => {
		if (order?.length) {
			setOrders(order);
		}
	}, [order]);

	return (
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
	);
};

export default StuffinBucket;
