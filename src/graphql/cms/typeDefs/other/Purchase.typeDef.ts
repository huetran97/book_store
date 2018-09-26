import gql from 'graphql-tag';

const purchase = gql`
    type Purchase{
        id: String
        user: User
        book: Book
        status: String
        number: Float
        shipping: ShippingCost
        amount: Float
        created_at: Float,
        updated_at: Float
    },
    type ListPurchase {
        offset: Int,
        limit: Int,
        total_purchase : Int,
        list_purchase: [Purchase]
    }
`;

export default purchase;