import { useEffect, MutableRefObject } from 'react';

type RefElements = MutableRefObject<HTMLDivElement | HTMLInputElement | null>;
type State = object | boolean;
type CloseFunction = () => void;

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
    }, []);
};

export default useClickOutside;
