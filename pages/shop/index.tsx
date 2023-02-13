import React, { useState, useEffect } from 'react';
import {
    interval, map, take, repeat,
} from 'rxjs';
import { useDispatch, useSelector } from 'react-redux';

import { SearchBar, ProductCard, Loader } from '../../components';
import { storeStuff } from '../../redux/ducks/stuff';
import { data$ } from '../api/api';

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

    const catchSearchInput = useSelector((state: { search: { search: string } }) => state.search.search);
    const stuff = useSelector((state: { stuff: { stuff: Stuff[] } }) => state.stuff.stuff);

    const dispatch = useDispatch();

    const observable$ = interval(400);

    const searchProducts = (text) => {
        if (text) {
            const filtered = stuff
                .filter((products) => Object.values(products).join('').toLowerCase().includes(text.toLowerCase()));

            setStuffs(filtered);
        } else {
            setStuffs(stuff);
        }
    };

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
        setLoading({
            ...isLoading,
            status: true,
        });

        data$.subscribe({
            next: async (result) => {
                try {
                    if (result) {
                        if (result.length) {
                            dispatch(storeStuff(result));
                        }

                        if (result.error) {
                            setError({
                                status: result.error,
                                message: result.message,
                            });
                        }
                    }
                } catch (err) {
                    console.log(err);
                }
            },
            complete: () => {
                setLoading({ status: false, loader: null });
            },
        });
    }, []);

    useEffect(() => {
        setStuffs(stuff);
    }, [stuff]);

    useEffect(() => {
        searchProducts(catchSearchInput);
    }, [catchSearchInput]);

    if (isLoading.status) {
        return (<div className={styles.loader}><Loader /></div>);
    }

    if (error.status) {
        return (<div className={styles.errorWrapper}>{ error.message }</div>);
    }

    return (
        <>
            <div className={styles.contentContainer}>
                <SearchBar />
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
