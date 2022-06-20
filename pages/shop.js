import React, {useState, useEffect} from 'react';
import { useQuery } from '@apollo/client';
import { BsCart } from 'react-icons/bs';
import { interval, map, take } from 'rxjs';
import { useDispatch, useSelector } from 'react-redux';

import { TAKE_PRODUCTS } from './api/api.ts';
import { inOrder } from '../redux/ducks/stuff';

import styles from '../styles/Shop.module.scss';
import Image from 'next/image';

const Shop = () => {
    const [stuffs, setStuffs] = useState([]);
    const [isLoading, setLoading] = useState(null)

    const select = useSelector(state => state.order.clientOrder)
    const dispatch = useDispatch();
    const { loading, error, data } = useQuery(TAKE_PRODUCTS);

    useEffect(() => {
        if (!loading && data) setStuffs(data.products);
        return error
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading]);

    const observable$ = interval(400);

    const loadProgress = ['Loading', 'Loading.', 'Loading..', 'Loading...'];

    useEffect(() => {
        const subscription = observable$
            .pipe(
                take(loadProgress.length),
                map(v => {
                    if (v) {
                        return loadProgress[v]
                    } 
                    if (v === 3) clearInterval();
                })
            )
            .subscribe((res) => setLoading(res));
        return () => subscription.unsubscribe();
    }, []);

    return (
        <>
            <div className={styles.contentContainer}>
                {
                    loading ? (
                        <div className={styles.loader}>{isLoading}</div>
                    ) : error ? (
                        <div className={styles.errorWrapper}>Seems somthing broken</div>
                    ) : stuffs ? stuffs.map(stuff => (
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
                    )) : null
                }
            </div>
        </>
    );
};

export default Shop;
