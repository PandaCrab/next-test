import React, { useState, useEffect } from 'react';
import { BsStar, BsStarFill, BsStarHalf } from 'react-icons/bs';
import { useRouter } from 'next/router';

import styles from '../styles/StarRating.module.scss';
import { rateProduct } from '../pages/api/api';

const StarRating = ({ product }) => {
    const [rating, setRating] = useState(0);
    const [rated, setRated] = useState();

    const router = useRouter();

    const calculateRating = ({ stars }) => {
        if (stars) {
            const { five, four, three, two, one } = stars;

            const rating = (5*five + 4*four + 3*three + 2*two + 1*one) / (five + four + three + two + one);

            setRating(rating);
        } else {
            setRating(0);
        }
    };

    const getRating = async(rated) => {
        await rateProduct(product._id, { rated });
    };

    useEffect(() => {
        calculateRating(product);
    }, [product]);

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
                        onClick={() => getRating(index)}
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
