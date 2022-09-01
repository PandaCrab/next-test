import React, { useState } from 'react';
import { BsStar, BsStarFill, BsStarHalf } from 'react-icons/bs';
import { useRouter } from 'next/router';

import styles from '../styles/StarRating.module.scss';

const StarRating = ({ product }) => {
    const [rating, setRating] = useState(0);

    const router = useRouter();

    return (
        <div className={styles.starsContainer}>
            {[...Array(5)].map((star, index) => {
                index += 1;
                return (
                    <button
                        key={index}
                        className={index <= rating
                            ? `${styles.starButton} ${styles.rated}`
                            : `${styles.starButton} ${styles.unrated}` }
                        onClick={() => setRating(index)}
                        onDoubleClick={() => setRating(0)}
                        disabled={router.pathname === '/cartPage'}
                    >
                        <span>{index <= rating ? (
                            <BsStarFill />
                        ) : (
                            <BsStar />
                        )}</span>
                    </button>
                );
            })}
        </div>
    );
};

export default StarRating;
