import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { RiUser3Line } from 'react-icons/ri';
import { useSelector } from 'react-redux';

import { commentSchema } from '../helpers/validation';
import { commentProduct, takeOneProduct } from '../pages/api/api';

import styles from '../styles/ProductComments.module.scss';

const ProductComments = ({ product, setProduct, productId }) => {
	const [commentInput, setCommentInput] = useState('');
	const [comments, setComments] = useState();
	const [invalid, setInvalid] = useState({
		message: null,
		valid: false
	});
console.log(comments)
	const user = useSelector((state) => state.user.info);
	const takeProduct = async () => {
		try {
			const res = await takeOneProduct(productId);

			if (res) {
				setProduct(res);
			}
		} catch (err) {
			console.log(err);
		}
	};

	const dateFormater = (dateToFormat) => {
		const time = new Date(dateToFormat).toLocaleTimeString();
		const date = new Date(dateToFormat).toLocaleDateString();

		return (`${time} ${date}`)
	};

	const postComment = async () => {
		await commentSchema
		.validate(commentInput)
		.then(async (value) => {
			if (value) {
				await commentProduct(productId, {
					userId: user?._id || null,
					userAvatar: user?.avatar ? user.avatart : null,
					userName: user?.username || null,
					createdDate: new Date(),
					message: commentInput
				});

				setCommentInput('')
				setInvalid({
					message: null,
					valid: true
				});
				takeProduct();
			}
		}).catch((error) => {
			if (error.message) {
				setInvalid({
					message: error.message,
					valid: false,
				});
			}
		});
	};

	useEffect(() => {
		setComments(product.comments)
	}, [product]);

	return (
		<div className={styles.container}>
			<div className={styles.commentAreaWrapper}>
				<textarea
					id="commentInput"
					className={invalid.message 
						? `${styles.commentInput} ${styles.invalid}` 
						: `${styles.commentInput}`}
					type="text"
					placeholder={invalid.message ?  invalid.message : 'Your comment goes here...'}
					value={commentInput}
					onChange={({ target }) => setCommentInput(target.value)}
				/>
				<button 
					className={styles.submitBtn}
					onClick={() => postComment()}
				>
					Submit
				</button>
			</div>
			<div className={styles.commentsWrapper}>
				{comments?.length ?
					comments.map((comment, index) => (
						<div
							key={index}
							className={styles.commentContainer}
						>
							<div className={styles.header}>
								<div className={styles.imageNameWrapper}>
									<div className={styles.imageWrapper}>
										{comment.userAvatar ? (
											<Image
												src={comment.userAvatar}
												alt={comment.userName}
												width="100px"
												height="100px"
											/>
										) : (
											<RiUser3Line />
										)}
									</div>
									<div className={styles.userName}>{comment.userName || 'user'}</div>
								</div>
								<div className={styles.dateWrapper}>{dateFormater(comment.createdDate)}</div>
							</div>
							<div className={styles.commentSection}>
								{String(comment.message).charAt(0).toUpperCase() + String(comment.message).slice(1)}
							</div>
						</div>
					)) : (
						<div>No comments for this product</div> 
					)}
			</div>
		</div>
	);
};

export default ProductComments;
