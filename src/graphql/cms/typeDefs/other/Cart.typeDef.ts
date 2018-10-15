import gql from 'graphql-tag';

const cart = gql`
    type Cart {
        id: String
        user: User
        book: Book
        promotion: Promotion
        number: Int
        price: Float
        created_at: Float,
        updated_at: Float
    },
    type ListCard {
        offset: Int,
        limit: Int,
        total_cart : Int,
        list_cart: [Cart]
    }
`;

export default cart;