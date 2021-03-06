import gql from 'graphql-tag';

const bill = gql`
    type Bill{
        id: String
        user: User
        cart: [Cart]
        payment_type: PAYMENT_TYPE
        isPaid: Boolean
        distance: Float
        status: String
        shipping: ShippingCost
        shipping_address: String
        created_at: Float,
        updated_at: Float
        total_amount: Float

    },
    type ListBill {
        offset: Int,
        limit: Int,
        total_bill : Int,
        list_bill: [Bill]
    }
`;

export default bill;