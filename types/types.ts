export type UserInfoResponse = {
    token: string | null;
    user?: {
        _id: string;
        emai: string;
        username: string;
        phone: string;
        admin?: boolean;
        age?: number
        likes?: Array<string>;
        shippingAddress?: {
            street: string;
            city: string;
            country: string;
            zip: string;
        };
    },
    message: string;
};

export type Stuff = {
    name: string;
    price: number;
    imgUrl: string;
    color?: string;
    quantity: number;
    width: number;
    height: number;
    description?: string;
    category: string;
    subcategory?: string;
    comments?: string[];
    stars: object;
}