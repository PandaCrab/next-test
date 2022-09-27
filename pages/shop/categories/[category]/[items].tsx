import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import { ProductCard } from '../../../../components';
import { takeCategories } from '../../../api/api';

import type { Stuff } from '../../../../types/types';

import styles from '../../../../styles/CategoryPage.module.scss';

const ClothesSubCategories = () => {
    const [stuff, setStuff] = useState<Stuff[]>([]);

    const router = useRouter();

    const takeProducts = async (category, subCategory) => {
        const res = await takeCategories(category, subCategory);

        setStuff(res);
    };

    useEffect(() => {
        const { category, items } = router.query;

        if (router.isReady) {
            takeProducts(category, items);
        }
    }, [router]);

    return (
        <div className={styles.container}>
            {stuff ? (
                stuff.map((product) => (
                    <ProductCard
                        key={product._id}
                        product={product}
                    />
                ))
            ) : (
                <div>This category is empty</div>
            )}
        </div>
    );
};

export default ClothesSubCategories;
