import React, { useState, useEffect } from 'react';
import { BsStar, BsStarFill, BsStarHalf } from 'react-icons/bs';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';

import { getUserInfo, rateProduct, userRated } from '../pages/api/api';
import { storeStuff } from '../redux/ducks/stuff';
import { getInfo } from '../redux/ducks/user';

import styles from '../styles/StarRating.module.scss';

const StarRating = ({ product }) => {
    const [tooltip, setTooltip] = useState(false);
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);

    const router = useRouter();
    const dispatch = useDispatch();
    const userInfo = useSelector(state => state.user.info);

    const calculateRating = ({ stars }) => {
        if (stars) {
            const { five, four, three, two, one } = stars;

            const rating = (5*five + 4*four + 3*three + 2*two + 1*one) / (five + four + three + two + one);

            setRating(rating);
        } else {
            setRating(0);
        }
    };

    const putRatedInUserData = async (rated) => {
        await userRated(userInfo.id, { id: product._id, rated });
        const res = await getUserInfo(userInfo.id);

        dispatch(getInfo(res));
    };

    const getRating = async (rated) => {
        putRatedInUserData(rated);
        const catchRes = await rateProduct(product._id, { rated });
        
        dispatch(storeStuff(catchRes));
    };

    useEffect(() => {
        calculateRating(product);
    }, [product]);
    return (
        <div className={styles.starsContainer}>
            {tooltip && (
                <div className={styles.tooltip}>{`You rated already`}</div>
            )}
            {[...Array(5)].map((star, index) => {
                index += 1;
                return (                        
                        <button
                            key={index}
                            className={index <= (hover || rating)
                                ? `${styles.starButton} ${styles.rated}`
                                : `${styles.starButton} ${styles.unrated}` }
                            onClick={userInfo?.rated?.find(el => el.productId === product._id) 
                                ? null
                                : () => { getRating(index); console.log(product._id) }}
                            disabled={router.pathname === '/cartPage'}
                            onMouseEnter={userInfo?.rated?.find(el => el.productId === product._id)
                                ? () => { setTooltip(true) }
                                : () => { setHover(index) }}
                            onMouseLeave={userInfo?.rated?.find(el => el.productId === product._id)
                                ? () => setTooltip(false)
                                : () => setHover(0)}
                        >
                            <span>
                                {index <= rating ? (
                                    <BsStarFill />
                                ) : (
                                    <BsStar />
                                )}
                            </span>
                        </button>
                );
            })}
        </div>
    );
};

export default StarRating;
