import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';

import { ProductCard, FilterBar, Loader } from '../../../../components';
import { loaderOff, loaderOn } from '../../../../redux/ducks/loader';
import { takeCategories } from '../../../api/api';

import type { Stuff } from '../../../../types/types';

import styles from '../../../../styles/CategoryPage.module.scss';

const Category = () => {
    const [product, setProduct] = useState<Stuff[]>([]);
    const [isLoading, setLoading] = useState<boolean>(false);

    const loader = useSelector((state: { loader: { loader: boolean }}) => state.loader.loader);
    const stuff = useSelector((state: { stuff: { stuff: Stuff[] } }) => state.stuff.stuff);

    const router = useRouter();
    const dispatch = useDispatch();
    
    const takeProducts = async (category, subcategory) => {
        const res = await takeCategories(category, subcategory);

        setProduct(res);
    };;

    useEffect(() => {
        const { category } = router.query;

        if (router.isReady) {
            takeProducts(category, null);
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
                <div className={styles.productWrapper}>
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

export default Category;
