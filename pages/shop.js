import React, {useState, useEffect} from 'react';
import { useQuery } from '@apollo/client';
import { BsCart } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';

import { TAKE_PRODUCTS } from './api/api.ts';
import { inOrder } from '../redux/ducks/stuff';

import styles from '../styles/Shop.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import Cart from '../components/cart';

const Shop = () => {
    const [stuffs, setStuffs] = useState([]);

    const select = useSelector(state => state.order.clientOrder)
    const dispatch = useDispatch();
    const { loading, error, data } = useQuery(TAKE_PRODUCTS);

    useEffect(() => {
        if (!loading) setStuffs(data.products)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading]);

    return (
        <>
            <div className={styles.contentContainer}>
                {
                    loading ? (
                        <div className={styles.loader}>Loading...</div>
                    ) : error ? (
                        <div className={styles.errorWrapper}>Seems somthing broken</div>
                    ) : stuffs.map(stuff => (
                        <div 
                            className={styles.productCard} 
                            key={ stuff.id }>
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
                                    onClick={() => dispatch(inOrder(stuff))}
                                    className={select.find(x => x.id === stuff.id) ? 
                                        `${styles.cartButton} ${styles.ordered}` :
                                        `${styles.cartButton}`
                                        }>
                                    <BsCart />
                                </button>
                            </div>
                        </div>
                    ))
                }
            </div>
        </>
    );
};

export default Shop;
