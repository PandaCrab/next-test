import { useEffect } from 'react';

import type { RefElements, State, CloseFunction } from '../types/types';

const useClickOutside = (ref: RefElements, state: State, closeFunction: CloseFunction) => {

    const clickOutside = ({target}) => {
        if (ref.current && !ref.current?.contains(target)) {
            closeFunction();
        }
    };

    useEffect(() => {
        if (state) {
            document.addEventListener('mousedown', clickOutside);
        }

        return () => document.removeEventListener('mousedown', clickOutside);
    }, [state]);
};

export default useClickOutside;
