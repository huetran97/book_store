import gql from 'graphql-tag';

const cart = gql`
    input Cart {
        book_store: String!
        promotion: String
        number: Int!
    },
    type CartOutPut {
        book_store: String!
        promotion: String
        number: Int!
    },
  
`;

export default cart;