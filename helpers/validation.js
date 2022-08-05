import * as yup from 'yup';

export const registrationSchema = yup.object().shape({
    username: yup.string()
        .matches(/^[a-z,.'-]+\s[a-z ,.'-]+$/i, 'Name invalid or not full')
        .required('Please enter full name'),
    email: yup.string()
        .email('Invalid email address')
        .required('Please enter email'),
    phone: yup.string()
        .min(10)
        .max(19)
        .required('Please enter phone number'),
    password: yup.string().required('Please enter password'),
    age: yup.number('Age can be only a number')
});

export const addressSchema = yup.object().shape({
    street: yup.string()
        .matches(/^[0-9]+\s[a-zA-Z .,'-]+$/g)
        .required('Enter street for shipping'),
    city: yup.string()
        .required('City field is required'),
    country: yup.string()
        .required('Country field is required'),
    zip: yup.string()
        .required('ZIP field is required')
});

export const phoneSchema = yup.object().shape({
    phone: yup.string()
        .min(10, 'Invalide phone number')
        .max(19, 'You enter to long phone')
        .required('Enter a contact phone')
});

export const userInfoSchema = yup.object().shape({
    name: yup.string()
        .matches(/^[a-z,.'-]+\s[a-z ,.'-]+$/i, 'Name invalid or not full')
        .required('Please enter your full name'),
    phone: yup.string()
        .min(10, 'Invalide phone number')
        .max(19, 'You enter to long phone')
        .required('Enter a contact phone'),
    optional: yup.string(),
    address: addressSchema
});
