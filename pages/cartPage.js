import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Image from 'next/image';
import { AiOutlineDelete } from 'react-icons/ai'
import Link from 'next/link';
import { useRouter } from 'next/router';

import { deleteFromOrder } from '../redux/ducks/stuff';

import styles from '../styles/CartPage.module.scss';

const CartPage = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const cart = useSelector(state => state.order.clientOrder);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
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
                                    <AiOutlineDelete />
                                </button>
                            </div>
                        </div>
                    )) : (
                        <div>
                            <div className={styles.emptyCart}>
                                Your cart don`t have any stuff
                            <Link href='/shop'>
                                <a>Buy somhting</a>
                            </Link>
                            </div>
                        </div>
                    )
                }
            </div>
            {cart.length && 
                    <button className={styles.orderButton} onClick={() => router.push(`/order/${Math.floor(Math.random() * 10000000)}`)}>
                        Create order
                    </button>
            }
        </div>
    );
};

export default CartPage;
