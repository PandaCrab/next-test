import Link from 'next/link';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';

const SuccessPage = () => {
	const orderId = useSelector((state) => state.order.orderId.order);

	const router = useRouter();

	useEffect(() => {
		if (router.isReady) {
			setTimeout(() => router.push('/'), 18000);
		}
	}, [router]);

	return (
		<div>
			Congratulations, Your order is:{' ' + orderId}
			<div>
				<Link href="/">
					<a>Back to home</a>
				</Link>
			</div>
		</div>
	);
};

export default SuccessPage;
