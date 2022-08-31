import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Image from 'next/image';
import { AiOutlineDelete } from 'react-icons/ai';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { deleteFromOrder } from '../redux/ducks/stuff';

import styles from '../styles/CartPage.module.scss';
import ProductCart from '../components/productCart';

const CartPage = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const cart = useSelector(state => state.order.clientOrder);

    return (
        <div className={styles.cartContainer}>
            <div className={styles.productWrapper}>
                {
                    cart.length ? cart.map((stuff, index) => (
                        <ProductCart key={index} product={stuff} />
                    )) : null
                }
            </div>
            {cart.length ? ( 
                <button 
                    className={styles.orderButton} 
                    onClick={() => router.push(`/order/${Math.floor(Math.random() * 10000000)}`)}
                >
                    Create order
                </button>
            ) : (
                <>
                    <div className={styles.emptyCart}>
                        Your cart don`t have any stuff
                        <Link href='/shop'>
                            <a>Buy somhting</a>
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
};

export default CartPage;
