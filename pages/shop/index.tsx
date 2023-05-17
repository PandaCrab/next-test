import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ProductCard, Loader, FilterBar } from '../../components';
import { loaderOff, loaderOn } from '../../redux/ducks/loader';

import type { Stuff } from '../../types/types';

import styles from '../../styles/Shop.module.scss';

const Shop = () => {
    const [stuffs, setStuffs] = useState<Stuff[]>([]);
    const [isLoading, setLoading] = useState<boolean>(false);
    
    const loader = useSelector((state: { loader: { loader: boolean }}) => state.loader.loader)
    const stuff = useSelector((state: { stuff: { stuff: Stuff[] } }) => state.stuff.stuff);
    const dispatch = useDispatch();

    useEffect(() => {
        if (stuff.length) {
            dispatch(loaderOff());
        }

        if (!stuff.length) {
            dispatch(loaderOn());
        }
    }, [stuff]);

    useEffect(() => {
        setLoading(loader);
    }, [loader]);

    useEffect(() => {
        if (!stuff.length) {
            setStuffs(stuff);
        }
    }, [stuff]);

    useState

    if (isLoading) {
        return (<div className={styles.loader}><Loader /></div>);
    }

    return (
        <>
            <div className={styles.contentContainer}>
                <FilterBar products={stuff} setProducts={setStuffs} />
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
