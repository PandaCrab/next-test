import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Image from 'next/image';

import { deleteFromOrder } from '../redux/ducks/stuff';

import styles from '../styles/CartPage.module.scss';

const CartPage = () => {
    const dispatch = useDispatch();
    const cart = useSelector(state => state.order.clientOrder);

    return (
        <div style={{margin: 'auto'}}>
            <div>
                Hello, i`m cart, and you buy: [sumthing]
            </div>
            <div className={styles.cartContainer}>
                {
                    cart.length ? cart.map(stuff => (
                        <div className={styles.productCard} key={ stuff.id }>
                            <div className={styles.cardContentWrapper}>
                                <Image 
                                    src={stuff.imgUrl} 
                                    alt={stuff.name}
                                    width="150px"
                                    height="200px" />
                                <div className={styles.cardInfo}>
                                    <div className={styles.stuffTitle}>
                                        { stuff.name }
                                    </div>
                                    <div className={styles.stuffColor}>{ stuff.color }</div>
                                    <div className={styles.stuffPrice}>${ stuff.price }</div>
                                </div>
                            </div>
                            <div className={styles.cardButtons}>
                                <button 
                                    onClick={() => dispatch(deleteFromOrder(stuff))}
                                    className={styles.deleteButton}>
                                    x
                                </button>
                            </div>
                        </div>
                    )) : (
                        <div>Your cart don`t have stuffs</div>
                    )
                }
            </div>
        </div>
    );
};

export default CartPage;
