import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { RiUser3Line } from 'react-icons/ri';
import { useSelector } from 'react-redux';

import { commentSchema } from '../helpers/validation';
import { commentProduct, takeOneProduct } from '../pages/api/api';

import type { Comments, Stuff, UserInfo } from '../types/types';

import styles from '../styles/ProductComments.module.scss';

interface InvalidState {
    message: string | null;
    valid: boolean;
};

interface Props {
    product: Stuff;
    setProduct: React.Dispatch<React.SetStateAction<Stuff>>;
    productId: string;
};

const ProductComments: React.FC<Props> = ({ product, setProduct, productId }) => {
    const [commentInput, setCommentInput] = useState<string>('');
    const [comments, setComments] = useState<Comments>();
    const [invalid, setInvalid] = useState<InvalidState>({
        message: null,
        valid: false,
    });

    const user = useSelector((state: { user: { info: UserInfo } }) => state.user.info);
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

    const dateFormater = (dateToFormat: Date) => {
        const time = new Date(dateToFormat).toLocaleTimeString();
        const date = new Date(dateToFormat).toLocaleDateString();

        return `${time} ${date}`;
    };

    const postComment = async () => {
        await commentSchema
            .validate(commentInput)
            .then(async (value) => {
                if (value) {
                    await commentProduct(productId, {
                        userId: user?._id || null,
                        photo: user?.photo ? user.photo : null,
                        username: user?.username || null,
                        createdDate: new Date(),
                        message: commentInput,
                    });

                    setCommentInput('');
                    setInvalid({
                        message: null,
                        valid: true,
                    });
                    takeProduct();
                }
            })
            .catch((error) => {
                if (error.message) {
                    setInvalid({
                        message: error.message,
                        valid: false,
                    });
                }
            });
    };

    useEffect(() => {
        setComments(product?.comments);
    }, [product]);

    return (
        <div className={styles.container}>
            <div className={styles.commentAreaWrapper}>
                <textarea
                    id="commentInput"
                    className={invalid.message ? `${styles.commentInput} ${styles.invalid}` : `${styles.commentInput}`}
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
                {comments?.length ? (
                    comments.map((comment, index) => (
                        <div
                            key={index}
                            className={styles.commentContainer}
                        >
                            <div className={styles.header}>
                                <div className={styles.imageNameWrapper}>
                                    <div className={styles.imageWrapper}>
                                        {comment.photo ? (
                                            <Image
                                                src={comment.photo}
                                                alt={comment.username}
                                                style={{ borderRadius: '50%' }}
                                                width="100px"
                                                height="100px"
                                            />
                                        ) : (
                                            <RiUser3Line />
                                        )}
                                    </div>
                                    <div className={styles.userName}>{comment.username || 'user'}</div>
                                </div>
                                <div className={styles.dateWrapper}>{dateFormater(comment.createdDate)}</div>
                            </div>
                            <div className={styles.commentSection}>
                                {String(comment.message).charAt(0).toUpperCase() + String(comment.message).slice(1)}
                            </div>
                        </div>
                    ))
                ) : (
                    <div>No comments for this product</div>
                )}
            </div>
        </div>
    );
};

export default ProductComments;
