import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

import { takeSomeProducts } from '../pages/api/api';

import styles from '../styles/LikedProducts.module.scss';

const LikedProducts = ({ view, setView }) => {
	const [likes, setLikes] = useState();

	const router = useRouter();

	const user = useSelector((state) => state.user.info);

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

	return (
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
	);
};

export default LikedProducts;
