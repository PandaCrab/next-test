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
        }),
        catchError(error => {
            return of({ error: true, message: `Error: ${error.message}` });
        })
    );

export const takeSomeProducts = async (id) => {
    try {
        const products = await fetchFunc(url + '/storage', 'POST', id);

        return products.json();
    } catch (err) {
        console.log(err);
    }
};

export const takeCategories = async (category, subcategory) => {
    try {
        if (category && subcategory) {
            const response = await fetch(url + `/storage/categories/${category}/${subcategory}`);

            return response.json();
        }

        if (!subcategory) {
            const response = await fetch(url + `/storage/categories/${category}`);

            return response.json();
        }
    } catch (err) {
        console.log(err);
    }
};

export const postProduct = (data: storageData) => fetchFunc( url + '/storage', 'POST', data);

export const deleteProduct = async (id) => {
    try {
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
    } catch (err) {
        console.log(err);
    }
};

export const loginUser = async (credentials) => {
    try {
        const catchRes = await fetchFunc('http://localhost:4000/auth', 'POST', credentials);
        
        return catchRes.json();
    } catch (err) {
        console.log(err);
    }
};

export const updateProductInStorage = async (product) => {
    try {
        const res = await fetch(url + '/storage', {
            mode: 'cors',
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify(product)
        });

        return res.json();
    } catch (err) {
        console.log(err);
    }
};

export const takeOneProduct = async (id) => {
    try {
        const product = await fetchFunc(url + `/storage/${id}`, 'GET');
        
        return product.json();
    } catch (err) {
        console.log(err);
    }
};

export const createOrder = async (order) => {
    try {
        const catchRes = await fetchFunc(url + '/orders/create', 'POST', order);

        return catchRes;
    } catch (err) {
        console.log(err);
    }
};

export const getUserOrders = async (userId) => {
    try {
        const takeUserOrders = await fetchFunc(url + '/orders/userOrders', 'POST', userId); 

        return takeUserOrders.json();
    } catch (err) {
        console.log(err);
    }
};

export const getUserOrder = async (orderId, userId) => {
    try {
        const catchRes = await fetchFunc(url + `/orders/userOrders/${orderId}`, "POST", userId);

        return catchRes.json();
    } catch (err) {
        console.log(err);
    }
};

export const getUserInfo = async (id) => {
    try {
        const response = await fetchFunc(url + `/user/${id}`, 'GET');
        
        return response.json();
    } catch (err) {
        console.log(err);
    }
};

export const updateUserInfo = async (id, info) => {
    try {
        const response = await fetch(url + `/user/${id}`, {
            mode: 'cors',
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify(info)
        });

        return response.json();
    } catch (err) {
        console.log(err)
    }
}

export const deleteUser = async (id, pass) => {
    try {
        const deleted = fetch(url + `/user/${id}`, {
            mode: 'cors',
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify(pass)
        });

        return (await deleted).json();
    } catch (err) {
        console.log(err)
    }
};

export const getUserLikes = async (userId, stuffId) => {
    try {
        const response = await fetch(url + '/user', {
            mode: 'cors',
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ userId, stuffId })
        });

        return response.json();
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
