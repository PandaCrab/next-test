export type Product = {
    name: string;
    price: number;
    imgUrl: string;
    color?: string;
    quantity: number;
    category: string;
    subcategory?: string;
    width: number;
    heigh: number;
    description?: string;
};

export type UpdateProduct = {
    _id: string;
    name?: string;
    price?: number;
    color?: string;
    quantity?: number
}

export type UserRatedProductId = {
    id: string;
    rated: number;
};

export type Order = {
    date: Date;
    userId: string;
    orderId: string;
    username: string;
    phone: string;
    optional?: string;
    shippingInfo: {
        street: string;
        city: string;
        country: string;
        zip: string;
    };
    orderInfo: {
        products: Array<object>;
    };
    payment: {
        payed: boolean;
        paymentType: string;
    };
};

export type CommentApi = {
    userId: string | null;
    photo: string | null;
    username: string;
    createdDate: Date;
    message: string;
};

export type Credentials = {
    username: string;
    password: string;
};

export type Info = {
    shippingInfo?: {
        street: string,
        city: string,
        country: string,
        zip: string,
    } | {}
    phone?: string };

export type Registration = {
    username: string,
    email: string,
    password: string,
    phone: string,
    age: number,
};
