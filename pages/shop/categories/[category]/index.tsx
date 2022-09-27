import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import { takeCategories } from '../../../api/api';
import { ProductCard } from '../../../../components';

import type { Stuff } from '../../../../types/types';

import styles from '../../../../styles/CategoryPage.module.scss';

const ClothesCategory = () => {
    const [stuff, setStuff] = useState<Stuff[]>([]);

    const router = useRouter();

    const takeProducts = async (category, subcategory) => {
        const res = await takeCategories(category, subcategory);

        setStuff(res);
    };

    useEffect(() => {
        const { category } = router.query;

        if (router.isReady) {
            takeProducts(category, null);
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

export default ClothesCategory;
