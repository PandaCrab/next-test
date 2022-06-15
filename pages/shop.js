import React, {useState, useEffect} from 'react';
import { useQuery } from '@apollo/client';
import { BsCart } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';

import { TAKE_PRODUCTS } from './api/api.ts';

import styles from '../styles/Shop.module.scss';
import Image from 'next/image';
import Link from 'next/link';

const Shop = () => {
    const [stuffs, setStuffs] = useState([]);
    const [inOrder, setInOrder] = useState({});

    const dispatch = useDispatch();
    const { loading, error, data } = useQuery(TAKE_PRODUCTS);

    useEffect(() => {
        if (!loading) setStuffs(data.products)
    }, [loading]);

    const addToOrder = (item) => {
        const { id } = item
        setInOrder(prev => ({
            ...prev,
            [id]: {
                id: [id],
                item: item
            }}));
    };

    return (
        <>
            <div className={styles.header}>
                <div>Choose what do you need and go to the order</div>
                <Link href="/">
                    <a className={styles.homeLink}>Home</a>
                </Link>
            </div>
            <div className={styles.contentContainer}>
                {
                    loading ? (
                        <div className={styles.loader}>Loading...</div>
                    ) : error ? (
                        <div className={styles.errorWrapper}>Seems somthing broken</div>
                    ) : stuffs.map(stuff => (
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
                                    onClick={() => addToOrder(stuff)}
                                    className={styles.cartButton}>
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
