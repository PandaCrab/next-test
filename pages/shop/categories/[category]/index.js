import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';

import { takeCategories } from '../../../api/api';

const ClothesCategory = () => {
    const [stuff, setStuff] = useState([]);

    const takeProducts = async (category, subCategory) => {
        const res = await takeCategories(category, subCategory);

        setStuff(res);
    };

    useEffect(() => {
        const { category, items } = router.query;

        if (router.isReady) {
            takeProducts(category, items);
        }
    }, []);
    console.log(stuff);
    const router = useRouter();
    console.log(router.query);
    return (
        <div>
            {stuff ? (
                stuff.map((product) => (
                    <div key={product._id}>
                        <div>
                            <Image src={product.imgUrl} alt={product.name} width="100px" height="100px" />
                        </div>
                        <div>
                            <div>{product.name}</div>
                            <div>{product.color}</div>
                            <div>{product.price}</div>
                            <div>{product.quantity < 30 && 'Produgt go out'}</div>
                        </div>
                    </div>
                ))
            ) : (
                <div>This category is empty</div>
            )}
        </div>
    );
};

export default ClothesCategory;
