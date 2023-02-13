import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

import type { Stuff } from '../types/types';

const useSortProducts = (sortItems) => {
    const [sorted, setSorted] = useState<Stuff[]>(sortItems);
    const [sortedBy, setSortedBy] = useState<string>('');

    const calculateRating = ({ stars }) => {
        if (stars) {
            const {
                five, four, three, two, one,
            } = stars;

            const calculated = (
                5 * five + 4 * four + 3 * three + 2 * two + 1 * one
            ) / (five + four + three + two + one);

            return calculated;
        } else {
            return 0;
        }
    };

    const sortingFunction = (items) => {
        let afterSort;
        switch (sortedBy) {
            case 'most-rated':
                afterSort =  items.sort((a: { stars: number }, b: { stars: number }) => {
                    const prev: number = Object.values(a.stars).reduce((a: number, b: number) => a + b, 0);
                    const current: number = Object.values(b.stars).reduce((a: number, b: number) => a + b, 0);

                    return (current - prev);
                });
                break;
            case 'rating':
                afterSort = items.sort((a, b) => {
                    const ratingA = calculateRating(a);
                    const ratingB = calculateRating(b);

                    return (ratingB - ratingA);
                });
                break;
            case 'quantity':
                afterSort = items.sort((a, b) => b.quantity - a.quantity);
                break;
            case 'price':
                afterSort = items.sort((a, b) => b.price - a.price);
                break;
            default: 
                afterSort = items.sort((a, b) => a.quantity - b.quantity);
                break;
        }

        return afterSort;
    };

    useEffect(() => {
        setSorted(sortingFunction(sortItems));
    }, [sortedBy]);

    return [sorted, setSortedBy];
};

useSortProducts.propTypes = {
    sortBy: PropTypes.string,
    sortItems: PropTypes.array
};

export default useSortProducts;
