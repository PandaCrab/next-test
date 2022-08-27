import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import { takeCategories } from '../../../api/api';
import ProductCart from '../../../../components/productCart';

const ClothesCategory = () => {
    const [stuff, setStuff] = useState([]);

    const router = useRouter();

    const takeProducts = async (category, subcategory) => {
        const res = await takeCategories(category, subcategory);

        setStuff(res);
    };
    console.log(stuff);
    useEffect(() => {
        const { category, items } = router.query;

        if (router.isReady) {
            takeProducts(category, null);
        }
    }, [router]);

    return (
        <div>
            {stuff ? (
                stuff.map((product) => <ProductCart key={product._id} product={product} />)
            ) : (
                <div>This category is empty</div>
            )}
        </div>
    );
};

export default ClothesCategory;
