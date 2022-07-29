import React, {useState, useEffect} from 'react';
import { BsCart } from 'react-icons/bs';
import { AiFillHeart } from 'react-icons/ai';
import { 
    interval,
    map, 
    take, 
    repeat 
} from 'rxjs';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Image from 'next/image';

import { inOrder, storeStuff } from '../../redux/ducks/stuff';
import { getInfo } from '../../redux/ducks/user';
import { data$, getUserInfo, getUserLikes } from '../api/api';

import styles from '../../styles/Shop.module.scss';

const Shop = () => {
    const [stuffs, setStuffs] = useState([]);
    const [error, setError] = useState({
        status: false,
        message: null
    });

    const [isLoading, setLoading] = useState({
        status: false,
        loader: null
    });

    const select = useSelector(state => state.order.clientOrder)
    const user = useSelector(state => state.user.info);

    const dispatch = useDispatch();
    const router = useRouter()

    const observable$ = interval(400);

    const takeUserInfo = async (id) => {
        const info = await getUserInfo(id);

        dispatch(getInfo(info));
    };

    const hendleLike = async (stuffId) => {
        try {
            const postLikes = await getUserLikes({
                userId: user.id,
                like: stuffId
            });

            if (postLikes.message === 'like' || 'unlike') {
                await takeUserInfo({_id: user.id});  
            } 

            return
        } catch (err) {
            console.log(err);
        }
    };

    const routeToProductInfo = (id) => {
        router.push(`shop/${id}`)
    };

    useEffect(() => {
        const loadProgress = ['Loading', 'Loading.', 'Loading..', 'Loading...'];

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
        });
        
        data$ && data$.subscribe({
            next: result => {
                setStuffs(result);
                dispatch(storeStuff(result.data));
            },
            complete: () => {
                setLoading({ status: false, loader: null });
            }
        });
        data$.unsubscribe;
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
                            key={ stuff._id }>
                            <div onClick={() => routeToProductInfo(stuff._id)} className={styles.cardContentWrapper}>
                                <Image 
                                    src={stuff.imgUrl} 
                                    alt={stuff.name}
                                    width={stuff.width ? `${stuff.width}px` :  '100px'}
                                    height={stuff.height ? `${stuff.height}px` : '150px'} />
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
                                    className={select.find(x => x._id === stuff._id) ? 
                                        `${styles.cartButton} ${styles.ordered}` :
                                        `${styles.cartButton}`
                                    }
                                >
                                    <BsCart />
                                </button>
                                {user && <button
                                    className={user.likes?.find(x => x._id === stuff._id) ? 
                                        `${styles.cartButton} ${styles.liked}`
                                        : `${styles.cartButton}`
                                    }
                                    onClick={() => hendleLike(stuff._id)}
                                >
                                    {<AiFillHeart />}
                                </button>}
                            </div>
                        </div>
                    )) : <div className={styles.errorWrapper}>Error</div>
                }
            </div>
        </>
    );
};

export default Shop;
