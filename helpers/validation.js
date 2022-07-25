import * as yup from 'yup';

export const registrationSchema = yup.object().shape({
    username: yup.string()
        .matches(/^[a-z,.'-]+\s[a-z ,.'-]+$/i, 'Please enter full name')
        .required('Please enter full name'),
    email: yup.string()
        .email('Invalid email address')
        .required('Please enter work email'),
    phone: yup.string()
        .min(10)
        .max(19)
        .required('Please enter phone number'),
    password: yup.string().required('Please enter password'),
    age: yup.number('Age can be only a number')
});