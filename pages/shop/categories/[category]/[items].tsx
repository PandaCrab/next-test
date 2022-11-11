import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';

import { FilterBar, Loader, ProductCard } from '../../../../components';
import { takeCategories } from '../../../api/api';
import { loaderOff, loaderOn } from '../../../../redux/ducks/loader';

import type { Stuff } from '../../../../types/types';

import styles from '../../../../styles/CategoryPage.module.scss';

const ClothesSubCategories = () => {
    const [product, setProduct] = useState<Stuff[]>([]);
    const [isLoading, setLoading] = useState<boolean>(false);

    const loader = useSelector((state: { loader: { loader: boolean }}) => state.loader.loader);

    const router = useRouter();
    const dispatch = useDispatch();

    const takeProducts = async (category, subCategory) => {
        const res = await takeCategories(category, subCategory);

        setProduct(res);
    };

    useEffect(() => {
        const { category, items } = router.query;

        if (router.isReady) {
            takeProducts(category, items);
        }
    }, [router]);

    useEffect(() => {
        if (product?.length) {
            dispatch(loaderOff());
        }

        if (!product?.length) {
            dispatch(loaderOn());
        }
    }, [product]);

    useEffect(() => {
        setLoading(loader);
    }, [loader]);

    if (isLoading) {
        return (
            <div className={styles.loader}>
                <Loader />
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <FilterBar products={product} setProducts={setProduct} />
            {product ? (
                <div className={styles.productsWrapper}>
                    {product.map((product) => (
                        <ProductCard
                            key={product._id}
                            product={product}
                        />
                    ))}
                </div>
            ) : (
                <div>This category is empty</div>
            )}
        </div>
    );
};

export default ClothesSubCategories;
