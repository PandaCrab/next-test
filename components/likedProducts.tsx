import Image from 'next/image';
import PropTypes from 'prop-types';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

import { takeSomeProducts } from '../pages/api/api';

import type { UserInfo, Stuff } from '../types/types';

import styles from '../styles/LikedProducts.module.scss';
import { useClickOutside } from '../hooks';

const LikedProducts = ({ view, setView }) => {
    const [likes, setLikes] = useState<Stuff[] | null>();
    const [animation, setAnimation] = useState<boolean>(false);

    const router = useRouter();

    const user = useSelector((state: { user: { info: UserInfo } }) => state.user.info);

    const ref: React.MutableRefObject<HTMLDivElement> | null = useRef(null);

    const dropdownStyles = `
        ${styles.itemsWrapper} 
        ${animation && (view.likes ? styles.openDropdown : styles.closeDropdown)}
    `;

    const catchLikedProducts = async (ids) => {
        const likedProducts = await takeSomeProducts(ids);

        if (likedProducts) {
            setLikes(likedProducts);
        }
    };

    const toggleDropdown = () => {
        setAnimation(true);

        setView((prev) => ({
            ...prev,
            likes: !prev.likes
        }));
    };

    const animationEndHandler = ({ animationName }) => {
        if (animationName === 'open-dropdown') {
            setView({
                ...view,
                likes: true
            });
            setAnimation(true);
        }

        if (animationName === 'close-dropdown') {
            setView({
                ...view,
                likes: false
            });
            setAnimation(false);
        }
    };

    useClickOutside(ref, view.likes, () => setView({ ...view, likes: false }));

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
                onClick={() => toggleDropdown()}
                className={styles.itemsHeader}
            >
                Your liked stuff
            </div>
            <div
                className={dropdownStyles}
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
