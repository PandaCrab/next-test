import React, { useState, useEffect } from 'react';
import { interval, map, take, repeat } from 'rxjs';
import { useDispatch, useSelector } from 'react-redux';

import SearchBar from '../../components/searchbar';
import { storeStuff } from '../../redux/ducks/stuff';
import { data$ } from '../api/api';

import styles from '../../styles/Shop.module.scss';
import ProductCart from '../../components/productCard';

const Shop = () => {
	const [stuffs, setStuffs] = useState([]);
	const [error, setError] = useState({
		status: false,
		message: null,
	});

	const [isLoading, setLoading] = useState({
		status: false,
		loader: null,
	});

	const catchSearchInput = useSelector((state) => state.search.search);
	const stuff = useSelector((state) => state.stuff.stuff);

	const dispatch = useDispatch();

	const observable$ = interval(400);

	const searchProducts = (text) => {
		if (text) {
			const filtered = stuff.filter((products) =>
				Object.values(products).join('').toLowerCase().includes(text.toLowerCase())
			);

			setStuffs(filtered);
		} else {
			setStuffs(stuff);
		}
	};

	useEffect(() => {
		const loadProgress = ['Loading', 'Loading.', 'Loading..', 'Loading...'];

		const subscription = observable$
			.pipe(
				take(loadProgress.length),
				map((value) => loadProgress[value]),

				repeat()
			)
			.subscribe((res) =>
				setLoading({
					loading: true,
					loader: res,
				})
			);
		return () => subscription.unsubscribe();
	}, [isLoading.loader]);

	useEffect(() => {
		setLoading({
			...isLoading,
			status: true,
		});

		data$ &&
			data$.subscribe({
				next: async (result) => {
					try {
						if (result) {
							if (result.length) {
								dispatch(storeStuff(result));
							}

							if (result.error) {
								setError({
									status: result.error,
									message: result.message,
								});
							}
						}
					} catch (err) {
						console.log(err);
					}
				},
				complete: () => {
					setLoading({ status: false, loader: null });
				},
			});
		data$.unsubscribe;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		setStuffs(stuff);
	}, [stuff]);

	useEffect(() => {
		searchProducts(catchSearchInput);
	}, [catchSearchInput]);

	return (
		<>
			<div className={styles.contentContainer}>
				<SearchBar />
				{isLoading.status ? (
					<div className={styles.loader}>{isLoading.loader}</div>
				) : error.status ? (
					<div className={styles.errorWrapper}>{error.message}</div>
				) : stuffs ? (
					<div className={styles.productWrapper}>
						{stuffs.map((product) => (
							<ProductCart
								key={product._id}
								product={product}
							/>
						))}
					</div>
				) : (
					<div className={styles.errorWrapper}>Error</div>
				)}
			</div>
		</>
	);
};

export default Shop;
