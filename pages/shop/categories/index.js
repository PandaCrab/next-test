import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const CategoriesPage = () => {
    const router = useRouter();

    return (
        <div>
            <div>
                <h1 onClick={() => router.push('/shop/categories/devices')}>Devices</h1>
                <Link href="/shop/categories/devices/phones">
                    <a>Phones</a>
                </Link>
                <Link href="/shop/categories/devices/laptops">
                    <a>Laptops</a>
                </Link>
                <Link href="/shop/categories/devices/watches">
                    <a>Watches</a>
                </Link>
            </div>
            <div>
                <h1
                    onClick={() => {
                        router.push('/shop/categories/Clothes');
                    }}
                >
                    Clothes
                </h1>
                <Link href="/shop/categories/devices/shirts">
                    <a>Shirts</a>
                </Link>
                <Link href="/shop/categories/devices/sneakers">
                    <a>Sneackers</a>
                </Link>
                <Link href="/shop/categories/devices/bags">
                    <a>Bags</a>
                </Link>
            </div>
        </div>
    );
};

export default CategoriesPage;
