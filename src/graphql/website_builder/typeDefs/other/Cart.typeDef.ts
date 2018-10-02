import gql from 'graphql-tag';

const cart = gql`
    type Cart {
        id: String
        user: User
        book: Book
        number: Int
        amount: Float
        created_at: Float,
    },
    type ListCard {
        offset: Int,
        limit: Int,
        total_cart : Int,
        list_cart: [Cart]
    }
`;

export default cart;