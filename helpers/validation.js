import * as yup from 'yup';

export const registrationSchema = yup.object().shape({
	username: yup
		.string()
		.matches(/^[a-z,.'-]+\s[a-z ,.'-]+$/i, 'Name invalid or not full')
		.required('Please enter full name'),
	email: yup.string().email('Invalid email address').required('Please enter email'),
	phone: yup.string().min(10).max(19).required('Please enter phone number'),
	password: yup.string().required('Please enter password'),
	age: yup.number('Age can be only a number'),
});

export const addressSchema = yup.object().shape({
	street: yup
		.string()
		.matches(/^[0-9]+\s[a-zA-Z .,'-]+$/g)
		.required('Enter street for shipping'),
	city: yup.string().required('City field is required'),
	country: yup.string().required('Country field is required'),
	zip: yup.string().required('ZIP field is required'),
});

export const phoneSchema = yup.object().shape({
	phone: yup
		.string()
		.min(10, 'Invalide phone number')
		.max(19, 'You enter to long phone')
		.required('Enter a contact phone'),
});

export const paymentValidation = Yup.object().shape({
	cardholder: Yup.string()
		.matches(/^((?:[A-Za-z]+ ?){1,3})$/, 'Enter correct cardholder name')
		.required('Enter a card holder name'),
	cardNum: Yup.string()
		.matches(/^([0-9]){4} ([0-9]){4} ([0-9]){4} ([0-9]){4}$/, 'Enter valid card number')
		.required('Enter a card number'),
	expire: Yup.string()
		.test('test-credit-card-expiration-date', 'Date has past', (expirationDate) => {
			if (!expirationDate) {
				return false;
			}

			const today = new Date();
			const monthToday = today.getMonth() + 1;
			const yearToday = today.getFullYear().toString().substring(2);

			const [expMonth, expYear] = expirationDate.split('/');

			if (Number(expYear) < Number(yearToday)) {
				return false;
			} else if (Number(expMonth) < monthToday && Number(expYear) <= Number(yearToday)) {
				return false;
			}

			return true;
		})
		.required('Enter expire date'),
	cvv: Yup.string()
		.matches(/^\d{3}$/, 'Invalid cvc')
		.required('Enter a cvc'),
});

export const userInfoSchema = yup.object().shape({
	name: yup
		.string()
		.matches(/^[a-z,.'-]+\s[a-z ,.'-]+$/i, 'Name invalid or not full')
		.required('Please enter your full name'),
	phone: yup
		.string()
		.min(10, 'Invalide phone number')
		.max(19, 'You enter to long phone')
		.required('Enter a contact phone'),
	optional: yup.string(),
	address: addressSchema,
});

export const addProductSchema = yup.object().shape({
	name: yup.string().required('Enter name of product'),
	price: yup.string().required('Enter product price'),
	imgUrl: yup.string().url('Invalid url address').required('Past image url path'),
	color: yup.string(),
	quantity: yup.string().required('Enter quantity of product'),
	category: yup.string().required('Please choose category'),
	subcategory: yup.string(),
	width: yup.string().required('Set image width'),
	height: yup.string().required('Set image height'),
	description: yup.string(),
});

export const commentSchema = yup.string().max(300, 'Max length is 300').required('Please fill the comment area');
