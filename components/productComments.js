import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { RiUser3Line } from 'react-icons/ri';

import styles from '../styles/ProductComments.module.scss';

const ProductComments = () => {
	const [commentInput, setCommentInput] = useState('');
	const [comments, setComments] = useState([]);

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

	useEffect(() => {
		setComments(mockComments);
	}, []);

	return (
		<div className={styles.container}>
			<div className={styles.commentAreaWrapper}>
				<textarea
					id="commentInput"
					className={styles.commentInput}
					type="text"
					max="300"
					cols="70"
					rows="10"
					value={commentInput}
					onChange={({ target }) => setCommentInput(target.value)}
				/>
				<button className={styles.submitBtn}>Submit</button>
			</div>
			<div className={styles.commentsWrapper}>
				{comments.length &&
					comments.map((comment, index) => (
						<div
							key={index}
							className={styles.commentContainer}
						>
							<div className={styles.header}>
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
								<div className={styles.createdDate}>{comment.createdDate}</div>
							</div>
							<div className={styles.commentSection}>{comment.message}</div>
						</div>
					))}
			</div>
		</div>
	);
};

export default ProductComments;
