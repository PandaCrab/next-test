import React, { useState, useEffect } from 'react';
import {
    interval, map, take, repeat,
} from 'rxjs';
import { useDispatch, useSelector } from 'react-redux';

import { ProductCard, Loader, FilterBar } from '../../components';
import { storeStuff } from '../../redux/ducks/stuff';
import { data$ } from '../api/api';
import useSortProducts from '../../hooks/sortProducts';

import type { Stuff } from '../../types/types';

import styles from '../../styles/Shop.module.scss';

interface Error {
    status: boolean;
    message: string | null
};

interface Loader {
    status: boolean;
    loader: string | null;
};

const Shop = () => {
    const [stuffs, setStuffs] = useState<Stuff[]>([]);
    const [error, setError] = useState<Error>({
        status: false,
        message: null,
    });
    const [isLoading, setLoading] = useState<Loader>({
        status: false,
        loader: null,
    });
    
    const stuff = useSelector((state: { stuff: { stuff: Stuff[] } }) => state.stuff.stuff);
    const [sorted, setSortedBy] = useSortProducts(stuffs);

    const observable$ = interval(400);

    useEffect(() => {
        console.log('hooray')
    }, [sorted]);

    useEffect(() => {
        const loadProgress = ['Loading', 'Loading.', 'Loading..', 'Loading...'];

        const subscription = observable$
            .pipe(
                take(loadProgress.length),
                map((value) => loadProgress[value]),

                repeat(),
            )
            .subscribe((res) => setLoading({
                status: true,
                loader: res,
            }));
        subscription.unsubscribe();
    }, [isLoading.loader]);

    useEffect(() => {
        if (!stuff) {
            setLoading({
                ...isLoading,
                status: true,
            });

            setTimeout(() => setLoading({
                ...isLoading,
                status: false
            }), 2500);
        }
    }, []);

    useEffect(() => {
        setStuffs(stuff);
    }, [stuff]);

    useState

    if (isLoading.status) {
        return (<div className={styles.loader}><Loader /></div>);
    }

    if (error.status) {
        return (<div className={styles.errorWrapper}>{ error.message }</div>);
    }

    return (
        <>
            <div className={styles.contentContainer}>
              <FilterBar products={stuffs} setProducts={setStuffs} sortBy={setSortedBy} />
                {stuffs ? (
                    <div className={styles.productWrapper}>
                        {stuffs.map((product) => (
                            <ProductCard
                                key={product._id}
                                product={product}
                            />
                        ))}
                    </div>
                ) : (
                    <div className={styles.errorWrapper}>Error!</div>
                )}
            </div>
        </>
    );
};

export default Shop;
