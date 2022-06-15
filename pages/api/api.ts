import { gql } from '@apollo/client';

import type { data } from "../../types";

const url = 'http://localhost:3004';
const apiKey = 'e2d9f960-bc78-11ec-a0da-bd0e50737306';
const addressApi = `https://app.geocodeapi.io/api/v1/`;

//Need write method to working correct
const fetchFunc = (url: string, method: string, data?: data) => {
    if (method === 'GET') return fetch(url)
    if (method === 'POST') fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(data)
    })
};

//fetch POST of personal info for billing to data
export const fetchPostData = (data: data) => fetchFunc(url+'/personInfo', "POST", data);

//fetch products in backet
export const fetchStuff = async() => {
    try {
        const response: any = await fetchFunc(url+'/products', 'GET');
        const json = await response.json();
        return json;
    } catch(errors) {
        return null;
    };
};

export const TAKE_PRODUCTS = gql`
    query basketProducts {
        products {
            id
            name
            price
            imgUrl
            color
        }
    }
`;

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

export const TAKE_PRODUCTS_FROM_STORAGE = gql`
    query allProductsFromStorage{
        productsStorage {
            id
            name
            price
            quantity
        }
    }
`;

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
            addressApi +
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
            addressApi+`autocomplete?apikey=${apiKey}&text=${endpoint.value.replace(/\s/g, '%20')}&size=5`,
            'GET');
        const json = await response.json();
        return json.features;
    } catch(errors) {
        return null;
    };
};
