import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';

import { takeCategories } from '../../../api/api';
import ProductCart from '../../../../components/productCart';

const ClothesCategory = () => {
    const [stuff, setStuff] = useState([]);

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
