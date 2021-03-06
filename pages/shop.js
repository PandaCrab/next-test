import React, {useState, useEffect} from 'react';
import { BsCart } from 'react-icons/bs';
import { 
    interval,
    switchMap,
    of,
    catchError, 
    map, 
    take, 
    repeat 
} from 'rxjs';
import { fromFetch } from 'rxjs/fetch'
import { useDispatch, useSelector } from 'react-redux';
import Image from 'next/image';

import { inOrder } from '../redux/ducks/stuff';

import styles from '../styles/Shop.module.scss';

const Shop = () => {
    const [stuffs, setStuffs] = useState([]);
    const [error, setError] = useState({
        status: false,
        message: null
    })
    const [isLoading, setLoading] = useState({
        stsatus: true,
        loader: null
    })

    const select = useSelector(state => state.order.clientOrder)

    const dispatch = useDispatch();

    const loadProgress = ['Loading', 'Loading.', 'Loading..', 'Loading...'];

    const observable$ = interval(400);

    useEffect(() => {
        const subscription = observable$
            .pipe(
                take(loadProgress.length),
                map(value => loadProgress[value]),
                repeat()
            )
            .subscribe((res) => setLoading({
                loading: true,
                loader: res
            }));
        return () => subscription.unsubscribe();
    }, [isLoading]);    

    useEffect(() => {
        setLoading({
            status:true
        })
        const data$ = fromFetch('http://localhost:4000/products')
            .pipe(
                switchMap(response => {
                    if (response.ok) {
                        return response.json()
                    }
                    return of({ error: true, message: `Error: ${response.status}` })
                }),
                catchError(error => {
                    setError({
                        status: true,
                        message: error.message
                    })
                })
            )
        
        data$.subscribe({
            next: result => setStuffs(result),
            complete: () => {
                setLoading({ status: false, loader: null });
            }
        })
        data$.unsubscribe
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <div className={styles.contentContainer}>
                {
                    isLoading.status ? (
                        <div className={styles.loader}>{isLoading.loader}</div>
                    ) : error.status ? (
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
