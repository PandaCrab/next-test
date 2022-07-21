import {
    switchMap,
    of,
    catchError
} from 'rxjs';
import { fromFetch } from 'rxjs/fetch'

import type { storageData,} from "../../types";

const url = 'http://localhost:4000';

//Need write method to working correct
const fetchFunc = (url: string, method: string, data?: any) => {
    if (method === 'GET') return fetch(url)
    if (method === 'POST') {
        return fetch(url, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify(data)
        });
    }
};

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

export const deleteProduct = async (id) => {
    const res = await fetch(url +`/storage`, {
        method: 'DELETE',
        mode: 'cors',
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json'
        },
        body: JSON.stringify(id)
    });

    return res;
};

export const loginUser = async (credentials) => {
    const catchRes = await fetchFunc('http://localhost:4000/auth', 'POST', credentials);
    
    return catchRes.json();
};

export const createOrder = async (order) => {
    try {
        const catchRes = await fetchFunc(url + '/orders','POST' , order);

        return catchRes;
    } catch (err) {
        console.log(err);
    }
};

export const getUserOrders = async (userId) => {
    try {
        const takeUserOrders = await fetchFunc(url + '/userOrders', 'POST', userId); 

        return takeUserOrders.json();
    } catch (err) {
        console.log(err);
    }
};

export const getUserOrder = async (id) => {
    try {
        const catchRes = await fetchFunc(url + '/userOrders/:id', "POST", id);

        return catchRes.json();
    } catch (err) {
        console.log(err);
    }
};

export const registrateUser = async (info) => {
    try {
        const catchRes = await fetchFunc(url + '/registration', 'POST', info);
        
        return catchRes.json();
    } catch (err) {
        console.log(err);
    }
};

export const getUserInfo = async (id) => {
    try {
        const response = await fetchFunc(url + '/users', 'POST', id);
        
        return response.json();
    } catch (err) {
        console.log(err);
    }
};
