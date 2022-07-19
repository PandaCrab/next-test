import React from 'react';
import { useSelector } from 'react-redux';
import Link from 'next/link';

const SuccessPage = () => {

    const orderId = useSelector(state => state.order.orderId.order);

    return (
        <div>
            Congratulations, Your order is:{' ' + orderId}
            <div>
                <Link href='/'>
                    <a>
                        Back to home
                    </a>
                </Link>
            </div>
        </div>
    );
};

export default SuccessPage;