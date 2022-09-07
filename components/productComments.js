import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { RiUser3Line } from 'react-icons/ri';
import { useSelector } from 'react-redux';

import { commentSchema } from '../helpers/validation';
import { commentProduct } from '../pages/api/api';

import styles from '../styles/ProductComments.module.scss';

const ProductComments = ({ product }) => {
	const [commentInput, setCommentInput] = useState('');
	const [invalid, setInvalid] = useState({
		path: null,
		valid: false
	});

	const { comments } = product;
	const user = useSelector((state) => state.user.info);

	const mockComments = [
		{
			userAvatar: false,
			userName: 'Some Name',
			createdDate: new Date().toUTCString(),
			message: 'That product awesome',
		},
		{
			userAvatar: false,
			userName: 'Some Name',
			createdDate: new Date().toUTCString(),
			message: 'That product awesome',
		},
		{
			userAvatar: false,
			userName: 'Some Name',
			createdDate: new Date().toUTCString(),
			message: 'That product awesome',
		},
		{
			userAvatar: false,
			userName: 'Some Name',
			createdDate: new Date().toUTCString(),
			message: 'That product awesome',
		},
	];

	const postComment = async () => {
		await commentSchema
			.validate(commentInput)
			.then(async (value) => {
				if (value) {
					await commentProduct(product._id, {
						userId: user.id,
						userAvatar: user?.avatar ? user.avatart : null,
						userName: user.username,
						createdDate: new Date().toUTCString,
						message: commentInput
					});

					setCommentInput('')
				}
			}).catch((error) => {
				const validationError = '';

                error.inner.forEach((err) => {
                    if (err.message) {
                        validationError = err.message;
                    }
                });

                setInvalid({
                    message: validationError,
                    valid: false,
                });
			})
	}

	return (
		<div className={styles.container}>
			<div className={styles.commentAreaWrapper}>
				<textarea
					id="commentInput"
					className={styles.commentInput}
					type="text"
					cols="30"
					rows="5"
					placeholder={invalid.message ? invalid.message : 'Your comment goes here...'}
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
				{comments.length ?
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
												onClick={() =>
													alert(`You have been routed to ${comment.userName} account page`)
												}
											/>
										) : (
											<RiUser3Line
												onClick={() =>
													alert(`You have been routed to ${comment.userName} account page`)
												}
											/>
										)}
									</div>
									<div className={styles.userName}>{comment.userName}</div>
								</div>
								<div className={styles.createdDate}>{comment.createdDate}</div>
							</div>
							<div className={styles.commentSection}>{comment.message}</div>
						</div>
					)) : (
						<div>No comments for whis product</div> 
					)}
			</div>
		</div>
	);
};

export default ProductComments;
