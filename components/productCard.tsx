import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { BsCart } from 'react-icons/bs';
import { AiFillHeart, AiOutlineDelete } from 'react-icons/ai';
import { useSelector, useDispatch } from 'react-redux';

import StarRating from './star-rating';
import QuantityReiser from './quantityReiser';
import { inOrder, deleteFromOrder } from '../redux/ducks/order';
import { getInfo } from '../redux/ducks/user';
import { getUserLikes, getUserInfo } from '../pages/api/api';

import type { Stuff, UserInfo } from '../types/types';

import styles from '../styles/ProductCard.module.scss';

interface Props {
    product: Stuff;
    inOrder?: boolean;
}

const ProductCard: React.FC<Props> = (props) => {
    const [product, setProduct] = useState<Stuff>(props.product);

    const user = useSelector((state: { user: { info: UserInfo } }) => state.user.info);
    const clientOrder = useSelector((state: { order: { clientOrder: Stuff[] } }) => state.order.clientOrder);

    const dispatch = useDispatch();
    const router = useRouter();

    const disabledBuyBtn = product.quantity === 0 || clientOrder.filter(
        e => e._id === product._id
    ).length >= product.quantity;

    const routeToProductInfo = (id) => {
        router.push(`/shop/${id}`);
    };

    const takeUserInfo = async () => {
        const info = await getUserInfo(user._id);

        dispatch(getInfo(info));
    };

    const pushToOrder = (stuff) => {
        const idInOrder = clientOrder.length;
        const { _id } = stuff;

        dispatch(
            inOrder({
                id: idInOrder,
                _id,
            }),
        );
    };

    const handleLike = async (productId) => {
        try {
            const postLikes = await getUserLikes(user._id, productId);

            if (postLikes.message === ('like' || 'unlike')) {
                await takeUserInfo();
            }

            return;
        } catch (err) {
            console.log(err);
        }
    };

    const buttonsToShow = () => {
        if (props.inOrder) {
            return (
                <div className={styles.cardButtons}>
                    <button
                        onClick={() => dispatch(deleteFromOrder(product))}
                        className={styles.deleteButton}
                    >
                        <AiOutlineDelete />
                    </button>
                </div>
            );
        }

        return (
            <div className={styles.cardButtons}>
                <button
                    onClick={() => pushToOrder(product)}
                    className={
                        clientOrder.find((x) => x._id === product._id)
                            ? `${styles.cartButton} ${styles.ordered}`
                            : `${styles.cartButton}`
                    }
                    disabled={disabledBuyBtn}
                >
                    <BsCart />
                </button>
                {user?._id && (
                    <button
                        className={
                            user.likes?.find((x) => x._id === product._id)
                                ? `${styles.cartButton} ${styles.liked}`
                                : `${styles.cartButton}`
                        }
                        onClick={() => handleLike(product._id)}
                    >
                        <AiFillHeart />
                    </button>
                )}
            </div>
        );
    };

    useEffect(() => {
        setProduct(props.product);
    }, [props]);

    return (
        <div className={styles.productWrapper}>
            <div className={`${styles.productCard} ${product.quantity === 0 && styles.outOfOrder}`}>
                <div className={styles.cardContentWrapper}>
                    <div className={styles.imageWrapper}>
                        <Image
                            src={product.imgUrl}
                            alt={product.name}
                            onClick={() => routeToProductInfo(product._id)}
                            width={product.width ? `${product.width}px` : '100px'}
                            height={product.height ? `${product.height}px` : '150px'}
                        />
                    </div>
                    <div className={styles.cardInfo}>
                        <div className={styles.productTitle}>{product.name}</div>
                        <div className={styles.productColor}>{product.color}</div>
                        <div className={styles.productPrice}>${product.price}</div>
                        {props.inOrder ? (
                            <QuantityReiser product={product} />
                        ) : (
                            <StarRating product={product} />
                        )}
                    </div>
                </div>
                {buttonsToShow()}
            </div>
        </div>
    );
};

export default ProductCard;
