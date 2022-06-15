import { store } from './redux/store';

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export type coordinates = {
    lat: number,
    lon: number
};

export type endpoint = {
    value: string
};

export type addressState = {
    addressInput: string,
    addresses: Object[],
    geolocation: {
        lat: number,
        lon: number
    },
    navigatorAddress: null| {
        street: string,
        city: string,
        country: string
    }
};

export type data = {
    shipping: {
        name: string,
        phone: any,
        street: string,
        optional: string,
        city: string,
        country: string,
        zip: string
    },
    billing: {
        name: string,
        email: string,
        street: string,
        optional: string,
        city: string,
        country: string,
        zip: string
    },
    payment: {
        cardHolder: string,
        cardNum: string,
        date: string,
        code: string
    }
};

export type addressAutocomplete = {
    properties: { 
        id?: React.Key, 
        name?: string,
        locality?: string,
        country: string, 
        street?: string,
        city?: string
        label?: string 
    };
};

export type values = { target: { value: string }};

export type actionAddressTypes = { 
    type: string,
    payload?: {
        lat?: number,
        lon?: number
        name?: string,
        locality?: string,
        country?: string,
        text?: string
        addresses?: {properties: {
            id?: number;
            name?: string;
            locality?: string;
            country?: string;
            label?: string;
        }}[]
    }
};

export type addressPayload = {
    addresses: {
        properties: {
            id: number;
            name: string;
            locality: string;
            country: string;
            label: string;
        }
    }[]
};
