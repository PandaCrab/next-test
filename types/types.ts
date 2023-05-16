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
    };
    message: string;
};

export type AddressInfo = {
    street: string;
    city: string;
    country: string;
    zip: string;
}

export type ShippingInfo = {
    name: string;
    phone: string;
    optional?: string;
    address: AddressInfo;
    orderInfo?: {
        products: Array<object>;
    };
}

export type Comments = {
    userId?: string | null;
    photo?: string | null;
    username: string;
    createdDate: Date;
    message: string;
    _id: string;
}[];

export type Stuff = {
    _id: string;
    name?: string;
    price?: number;
    imgUrl?: string;
    color?: string;
    quantity?: number;
    width?: number;
    height?: number;
    description?: string;
    category?: string;
    subcategory?: string;
    comments?: Comments;
    stars?: {
        one: number;
        two: number;
        three: number;
        four: number;
        five: number;
    };
};

export type FilterCriteria = {
    name?: string;
    price?: number[];
    colors?: string[];
}

export type OrderInfo = {
    _id: string;
    date: Date;
    status?: string;
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
        products: Stuff[];
    };
    payment: {
        payed: boolean;
        paymentType: string;
    };
};

export type userObject = {
    token: string | null;
    info?: {
        _id: string;
        emai: string;
        username: string;
        phone: string;
        admin?: boolean;
        age?: number;
        photo?: string;
        rated?: object;
        likes?: Array<string>;
        shippingAddress?: {
            street: string;
            city: string;
            country: string;
            zip: string;
        };
    };
};

export type UserInfo = {
    _id: string;
    emai: string;
    username: string;
    phone: string;
    admin?: boolean;
    age?: number;
    photo?: string | null;
    rated?: {
        productId: string;
        rated: number;
    }[];
    likes?: {
        _id: string
    }[];
    shippingAddress?: {
        street: string;
        city: string;
        country: string;
        zip: string;
    };
}

export type ReduxStore = {
    stuff: { stuff: Stuff[] };
    user: {
        token: string | null;
        info: userObject;
    };
    alert: {
        success: string;
        warning: string;
        error: string;
    };
    search: { search: string };
    order: {
        shippingInfo: ShippingInfo | {};
        orderId: string;
        clientOrder: object[] | undefined[];
    };
    loader: { loader: boolean };
};

export type ObservableResult = Stuff[] | {
    error: boolean;
    message: string
};

export type AccountViews = {
    viewedStuff: boolean;
    likes: boolean;
    addressForm: boolean;
    phoneChanging: boolean;
    settings: boolean;
    agreeDeletion: boolean;
    confirmPassword: boolean;
}

export type InvalidAddressForm = {
    path: {
        phone?: string;
        street?: string;
        city?: string;
        country?: string;
        zip?:string;
    };
    isValid: boolean;
}

export type RefElements = React.MutableRefObject<HTMLDivElement | HTMLInputElement | null>;

export type State = object | boolean;

export type CloseFunction = () => void;
