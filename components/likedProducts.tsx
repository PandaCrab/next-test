import Image from 'next/image';
import PropTypes from 'prop-types';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

import { takeSomeProducts } from '../pages/api/api';

import type { UserInfo, Stuff } from '../types/types';

import styles from '../styles/LikedProducts.module.scss';

const LikedProducts = ({ view, setView }) => {
    const [likes, setLikes] = useState<Stuff[] | null>();

    const router = useRouter();

    const user = useSelector((state: { user: { info: UserInfo } }) => state.user.info);

    const ref: React.MutableRefObject<HTMLDivElement> | null = useRef(null);

    const catchLikedProducts = async (ids) => {
        const likedProducts = await takeSomeProducts(ids);

        if (likedProducts) {
            setLikes(likedProducts);
        }
    };

    const animationEndHandler = ({ animationName }) => {
        if (animationName === 'open-dropdown') {
            setView({
                ...view,
                likes: true
            });
        }

        if (animationName === 'close-dropdown') {
            setView({
                ...view,
                likes: false
            });
        }
    };

    const clickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
            setView({
                ...view,
                likes: false
            });
        }
    }

    useEffect(() => {
        if (view.likes) {
            document.addEventListener('mousedown', clickOutside);
        }

        return () => document.removeEventListener('mousedown', clickOutside);
    }, [view]);

    useEffect(() => {
        if (user?.likes?.length) {
            catchLikedProducts(user.likes);
        } else {
            setLikes(null);
        }
    }, [user]);
    
    return (
        <div className={styles.likes} ref={ref}>
            <div
                onClick={() => setView((prev) => ({
                    ...prev,
                    likes: !prev.likes,
                }))
                }
                className={styles.itemsHeader}
            >
                Your liked stuff
            </div>
            <div
                className={
                    view.likes ? `${styles.itemsWrapper} ${styles.openDropdown}`
                    : `${styles.itemsWrapper} ${styles.closeDropdown}`
                }
                onAnimationEnd={(event) => animationEndHandler(event)}
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

LikedProducts.propTypes = {
    view: PropTypes.object,
    setView: PropTypes.func,
};

export default LikedProducts;
