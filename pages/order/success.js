import React from 'react';
import { useSelector } from 'react-redux';
import Link from 'next/link';

const SuccessPage = () => {

    const selector = useSelector(state => state.order.orderId)

    return (
        <div>
            Congratulations, Your order is:{' ' + selector.order}
            <div>
                <Link href='/'>
                    <a>
                        back to home
                    </a>
                </Link>
            </div>
        </div>
    )
}

export default SuccessPage;