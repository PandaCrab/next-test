import PropTypes from 'prop-types';
import React, { useState, useEffect, SetStateAction } from 'react';

import type { Stuff } from '../types/types';

interface Stars {
    five: number;
    four: number;
    three: number;
    two: number;
    one: number;
}

const useSortProducts = (sortItems: Stuff[]): [Stuff[] | [], React.Dispatch<SetStateAction<string>>] => {
    const [sorted, setSorted] = useState<Stuff[]>();
    const [sortedBy, setSortedBy] = useState<string>('');

    const calculateRating = ({ stars }: { stars?: Stars }) => {
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

    let afterSort;
    
    switch (sortedBy) {
        case 'most-rated':
            afterSort =  [].concat(sortItems).sort((a: { stars: Stars }, b: { stars: Stars }) => {
                const prev: number = Object.values(a.stars).reduce((a: number, b: number) => a + b, 0);
                const current: number = Object.values(b.stars).reduce((a: number, b: number) => a + b, 0);

                return (current - prev);
            });
            break;
        case 'rating':
            afterSort = [].concat(sortItems).sort((a: Stuff, b: Stuff) => {
                const ratingA = calculateRating(a);
                const ratingB = calculateRating(b);

                return (ratingB - ratingA);
            });
            break;
        case 'rating-lower':
            afterSort = [].concat(sortItems).sort((a: Stuff, b: Stuff) => {
                const ratingA = calculateRating(a);
                const ratingB = calculateRating(b);

                return (ratingA - ratingB);
            });
            break;
        case 'quantity':
            afterSort = [].concat(sortItems).sort((a, b) => b.quantity - a.quantity);
            break;
        case 'quantity-reverse':
            afterSort = [].concat(sortItems).sort((a, b) => a.quantity - b.quantity);
            break;
        case 'price':
            afterSort = [].concat(sortItems).sort((a, b) => b.price - a.price);
            break;
        case 'price-cheap':
            afterSort = [].concat(sortItems).sort((a, b) => b.price - a.price);
            break;
        default: 
            afterSort = [].concat(sortItems).sort((a, b) => b.quantity - a.quantity);
            break;
    }

    useEffect(() => {
        setSorted(afterSort);
    }, [sortedBy]);
    
    return [sorted, setSortedBy];
};

useSortProducts.propTypes = {
    sortItems: PropTypes.array
};

export default useSortProducts;
