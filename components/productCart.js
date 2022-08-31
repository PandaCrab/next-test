import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { BsCart } from 'react-icons/bs';
import { AiFillHeart, AiOutlineDelete } from 'react-icons/ai';
import { useSelector, useDispatch } from 'react-redux';

import { inOrder, deleteFromOrder } from '../redux/ducks/stuff';
import { getInfo } from '../redux/ducks/user';
import { getUserLikes, getUserInfo } from '../pages/api/api';

import styles from '../styles/ProductCart.module.scss';

const ProductCart = (props) => {
    const [product, setProduct] = useState(props.product);

    const user = useSelector((state) => state.user.info);
    const clientOrder = useSelector((state) => state.order.clientOrder);

    const dispatch = useDispatch();
    const router = useRouter();

    const routeToProductInfo = (id) => {
        router.push(`/shop/${id}`);
    };

    const takeUserInfo = async () => {
        const info = await getUserInfo(user.id);

        dispatch(getInfo(info));
    };

    const pushToOrder = (product) => {
        const idInOrder = clientOrder.length;
        const { _id, name, price, imgUrl, color, quantity, width, height } = product;

        dispatch(
            inOrder({
                id: idInOrder,
                _id,
                name,
                price,
                imgUrl,
                color,
                quantity,
                width,
                height,
            })
        );
    };

    const handleLike = async (productId) => {
        try {
            const postLikes = await getUserLikes(user.id, productId);

            if (postLikes.message === 'like' || 'unlike') {
                await takeUserInfo();
            }

            return;
        } catch (err) {
            console.log(err);
        }
    };
    console.log(props.product);
    useEffect(() => {
        setProduct(props.product);
    }, [props]);

    return (
        <div className={styles.productWrapper}>
            <div className={styles.productCard}>
                <div onClick={() => routeToProductInfo(product._id)} className={styles.cardContentWrapper}>
                    <div className={styles.imageWrapper}>
                        <Image
                            src={product.imgUrl}
                            alt={product.name}
                            width={product.width ? `${product.width}px` : '100px'}
                            height={product.height ? `${product.height}px` : '150px'}
                        />
                    </div>
                    <div className={styles.cardInfo}>
                        <div className={styles.productTitle}>{product.name}</div>
                        <div className={styles.productColor}>{product.color}</div>
                        <div className={styles.productPrice}>${product.price}</div>
                    </div>
                </div>
                {router.pathname === '/cartPage' ? (
                    <div className={styles.cardButtons}>
                        <button 
                            onClick={() => dispatch(deleteFromOrder(product))}
                            className={styles.deleteButton}
                        >
                            <AiOutlineDelete />
                        </button>
                    </div>
                ) : (
                    <div className={styles.cardButtons}>
                        <button
                            onClick={() => pushToOrder(product)}
                            className={
                                clientOrder.find((x) => x._id === product._id)
                                    ? `${styles.cartButton} ${styles.ordered}`
                                    : `${styles.cartButton}`
                            }
                        >
                            <BsCart />
                        </button>
                        {user?.id && (
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
                )}
            </div>
        </div>
    );
};

export default ProductCart;
