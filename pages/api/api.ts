import {
    switchMap,
    of,
    catchError
} from 'rxjs';
import { fromFetch } from 'rxjs/fetch'

import type { storageData, data } from "../../types";

const url = 'http://localhost:4000';
const autocompleteApiUrl = `https://app.geocodeapi.io/api/v1/`;
const apiKey = 'e2d9f960-bc78-11ec-a0da-bd0e50737306';

export const data$ = fromFetch('http://localhost:4000/storage')
    .pipe(
        switchMap(response => {
            if (response.ok) {
                return response.json();
            }
            return of({ error: true, message: `Error: ${response.status}` })
        }),
        catchError(error => {
            return error.message;
        })
    );

export const postProduct = (data: storageData) => fetchFunc( url + '/storage', 'POST', data);

export const loginUser = async (credentials) => {
    const catchRes = await fetch('http://localhost:4000/auth', {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json'
        },
        body: JSON.stringify(credentials)
    });
    
    return catchRes.json();
};

export const createOrder = async (order) => {
    const catchRes = await fetch(url + '/order', {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json'
        },
        body: JSON.stringify(order)
    });
    return catchRes;
}

export const registrateUser = async (info) => {
    const catchRes = await fetch('http://localhost:4000/registration', {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json'
        },
        body: JSON.stringify(info)
    });
    
    return catchRes.json();
};

export const getUserInfo = async (id) => {
    try {
        const response = await fetch(url + '/users', {
            mode: 'cors',
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify(id)
        });
        
        return response.json();
    } catch (err) {
        console.log(err);
    }
};
//Need write method to working correct
const fetchFunc = (url: string, method: string, data?: any) => {
    if (method === 'GET') return fetch(url)
    if (method === 'POST') fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
};

//fetch POST of personal info for billing to data
export const fetchPostData = (data: data) => fetchFunc(url+'/personalInfo', 'POST', data);

//fetch stuff from storage
export const fetchProductsStorage = async() => {
    try {
        const response: any = await fetchFunc(url+'/productsStorage', 'GET');
        const json = await response.json();
        return json;
    } catch(error) {
        console.error(error)
        return null;
    };
};

//fetch by coordinates
const coordinates: {lat: number, lon: number} = {
    lat: 0,
    lon: 0
};
export const getGeolocation = (geolocation: {lat: number, lon: number}) => {
    coordinates.lat = geolocation.lat;
    coordinates.lon = geolocation.lon;
};

export const fetchGeolocation: () => Promise<{}> = async() => {
    try {
        const response: any = await fetchFunc(
            autocompleteApiUrl +
            `reverse?apikey=${apiKey}&point.lat=${coordinates.lat}&point.lon=${coordinates.lon}&layers=address`,
            'GET'
        );
        const json = await response.json();
        return json.features[0].properties;
    } catch(errors) {
        return null;
    };
};

//fetch by input
const endpoint: {value: string} = {value: ''};
export const getEndpoint = (addressInput: string) => {
    if (addressInput.length) { endpoint.value = addressInput }
};

export const fetchAddress: () => Promise<{}> = async () => {
    try {
        const response: any = await fetchFunc(
            autocompleteApiUrl+`autocomplete?apikey=${apiKey}&text=${endpoint.value.replace(/\s/g, '%20')}&size=5`,
            'GET');
        const json = await response.json();
        return json.features;
    } catch(errors) {
        return null;
    };
};
