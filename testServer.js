const { ApolloServer, gql } = require('apollo-server');

const typeDefs = gql`
    type ProductInStorage {
        id: Int
        name: String
        imgUrl: String
        color: String
        price: Float
        ordered: Boolean
        quantity: Float
    }

    type Product {
        id: ID!
        name: String
        imgUrl: String
        color: String
        price: Float
        ordered: Boolean
        writable: Boolean
    }
    
    type Shipping {
        name: String
        phone: String
        street: String
        optional: String
        city: String
        country: String
        zip: String
    }

    type Billing {
        name: String
        email: String
        street: String
        oprional: String
        city: String
        country: String
        zip: String
    }

    type Payment {
        cardholder: String
        cardNum: String
        date: String
        cvv: String
    }

    type PersonInfo {
        shipping: [Shipping]
        billing: [Billing]
        payment: [Payment]
    }

    type Query {
        productsStorage: [ProductInStorage]
        personInfo: [PersonInfo]
        product(id: ID! ): Product
        products: [Product]
    }
`;

const productsStorage = [
    {
      id: 1,
      imgUrl: "https://guesseu.scene7.com/is/image/GuessEU/M63H24W7JF0-L302-ALTGHOST?wid=1500&fmt=jpeg&qlt=80&op_sharpen=0&op_usm=1.0,1.0,5,0&iccEmbed=0",
      name: "Check Print Shirt",
      color: "Grey+red+black",
      price: 110,
      quantity: 0
    },
    {
      id: 2,
      imgUrl: "https://guesseu.scene7.com/is/image/GuessEU/FLGLO4FAL12-BEIBR?wid=700&amp;fmt=jpeg&amp;qlt=80&amp;op_sharpen=0&amp;op_usm=1.0,1.0,5,0&amp;iccEmbed=0",
      name: "Gloria Hight Logo Sneaker",
      price: 91,
      quantity: 12
    },
    {
      id: 3,
      imgUrl: "https://guesseu.scene7.com/is/image/GuessEU/HWVG6216060-TAN?wid=700&amp;fmt=jpeg&amp;qlt=80&amp;op_sharpen=0&amp;op_usm=1.0,1.0,5,0&amp;iccEmbed=0",
      name: "Cate Rigid Bag",
      price: 94.5,
      quantity: 29
    },
    {
      id: 4,
      imgUrl: "http://guesseu.scene7.com/is/image/GuessEU/WC0001FMSWC-G5?wid=520&fmt=jpeg&qlt=80&op_sharpen=0&op_usm=1.0,1.0,5,0&iccEmbed=0",
      name: "Guess Connect Watch",
      color: "Black",
      price: 438.9,
      quantity: 23
    },
    {
      id: 5,
      imgUrl: "https://guesseu.scene7.com/is/image/GuessEU/AW6308VIS03-SAP?wid=700&amp;fmt=jpeg&amp;qlt=80&amp;op_sharpen=0&amp;op_usm=1.0,1.0,5,0&amp;iccEmbed=0",
      name: "'70s Retro Glam Kefiah",
      price: 20,
      quantity: 23
    }
];

const products = [
{
    id: 1,
    imgUrl: "https://guesseu.scene7.com/is/image/GuessEU/M63H24W7JF0-L302-ALTGHOST?wid=1500&fmt=jpeg&qlt=80&op_sharpen=0&op_usm=1.0,1.0,5,0&iccEmbed=0",
    name: "Check Print Shirt",
    color: "Grey+red+black",
    price: 110
},
{
    id: 2,
    imgUrl: "https://guesseu.scene7.com/is/image/GuessEU/FLGLO4FAL12-BEIBR?wid=700&amp;fmt=jpeg&amp;qlt=80&amp;op_sharpen=0&amp;op_usm=1.0,1.0,5,0&amp;iccEmbed=0",
    name: "Gloria Hight Logo Sneaker",
    price: 91
},
{
    id: 3,
    imgUrl: "https://guesseu.scene7.com/is/image/GuessEU/HWVG6216060-TAN?wid=700&amp;fmt=jpeg&amp;qlt=80&amp;op_sharpen=0&amp;op_usm=1.0,1.0,5,0&amp;iccEmbed=0",
    name: "Cate Rigid Bag",
    price: 94.5
},
{
    id: 4,
    imgUrl: "http://guesseu.scene7.com/is/image/GuessEU/WC0001FMSWC-G5?wid=520&fmt=jpeg&qlt=80&op_sharpen=0&op_usm=1.0,1.0,5,0&iccEmbed=0",
    name: "Guess Connect Watch",
    color: "Black",
    price: 438.9
},
{
    id: 5,
    imgUrl: "https://guesseu.scene7.com/is/image/GuessEU/AW6308VIS03-SAP?wid=700&amp;fmt=jpeg&amp;qlt=80&amp;op_sharpen=0&amp;op_usm=1.0,1.0,5,0&amp;iccEmbed=0",
    name: "'70s Retro Glam Kefiah",
    price: 20
}
];

const personInfo = [];

const resolvers = {
    Query: {
        productsStorage: () => productsStorage,
        products: () => products,
        personInfo: () => personInfo
    }
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevenition: true
});

server.listen().then(({ url }) => {
    console.log(`Server ready on ${url}`)
});
