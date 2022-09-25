import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { BsStar, BsStarFill, BsStarHalf } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';

import { rateProduct, userRated } from '../pages/api/api';
import { storeStuff } from '../redux/ducks/stuff';
import { getInfo } from '../redux/ducks/user';

import type { UserInfo, Stuff } from '../types/types';

import styles from '../styles/StarRating.module.scss';

interface StarObject {
    one: number;
    two: number;
    three: number;
    four: number;
    five: number;
};

const StarRating = ({ product }: { product: Stuff }) => {
    const [tooltip, setTooltip] = useState(false);
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);

    const dispatch = useDispatch();
    const userInfo = useSelector((state: { user: { info: UserInfo } }) => state.user.info);

    const calculateRating = ({ stars }: { stars?: StarObject }) => {
        if (stars) {
            const {
                five, four, three, two, one,
            } = stars;

            const calculated = (
                5 * five + 4 * four + 3 * three + 2 * two + 1 * one
            ) / (five + four + three + two + one);

            setRating(calculated);
        } else {
            setRating(0);
        }
    };

    const showRating = (index: number, rate: number) => {
        if (rate >= 4.5) {
            return <BsStarFill />;
        }

        if (index - 1 < rate && index > rate) {
            return <BsStarHalf />;
        }

        if (index <= rate) {
            return <BsStarFill />;
        }

        if (index > rate) {
            return <BsStar />;
        }
    };

    const starsClassName = (index: number) => {
        const ratedStars = index - 0.9999 <= (hover || rating);

        return ratedStars ? `${styles.starButton} ${styles.rated}` : `${styles.starButton} ${styles.unrated}`;
    };

    const starMouseEnterHendler = (info: UserInfo, index: number) => {
        const rated = info?._id && userInfo?.rated?.find((el) => el.productId === product._id);

        return rated ? () => { setTooltip(true); } : () => { setHover(index); };
    };

    const starMouseLeaveHendler = (info: UserInfo) => {
        if (info?.rated?.find((el) => el.productId === product._id)) {
            setTooltip(false);
        } else {
            setHover(0);
        }
    };

    const putRatedInUserData = async (rated: number) => {
        const res = await userRated(userInfo._id, { id: product._id, rated });
        dispatch(getInfo(res));
    };

    const getRating = async (rated: number) => {
        putRatedInUserData(rated);
        const catchRes = await rateProduct(product._id, { rated });

        setHover(0);
        dispatch(storeStuff(catchRes));
    };

    const starClickHendler = (info: UserInfo, index: number) => {
        const notRated = info?._id && info?.rated?.find((el) => el.productId === product._id);

        return notRated ? null : () => getRating(index);
    };

    useEffect(() => {
        calculateRating(product);
    }, [product]);
    return (
        <div className={styles.starsContainer}>
            {tooltip && <div className={styles.tooltip}>{'You rated already'}</div>}
            {[...Array(5)].map((star, index) => {
                // eslint-disable-next-line no-param-reassign
                index += 1;
                return (
                    <button
                        key={index}
                        className={ starsClassName(index) }
                        onClick={ starClickHendler(userInfo, index) }
                        onMouseEnter={ starMouseEnterHendler(userInfo, index) }
                        onMouseLeave={ () => starMouseLeaveHendler(userInfo) }
                    >
                        <span>
                            { showRating(index, rating) }
                        </span>
                    </button>
                );
            })}
        </div>
    );
};

StarRating.propTypes = {
    product: PropTypes.object,
};

export default StarRating;
