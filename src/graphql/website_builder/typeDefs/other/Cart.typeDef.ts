import gql from 'graphql-tag';

const cart = gql`
    input Cart {
        book_store: String!
        promotion: String
        number: Int!
    },
    type CartOutPut {
        id: String
        user: User
        book: Book
        store: Store
        promotion: Promotion
        number: Int
        price: Float
        created_at: Float,
        updated_at: Float
    },
  
`;

export default cart;