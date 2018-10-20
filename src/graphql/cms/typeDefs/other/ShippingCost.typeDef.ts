import gql from 'graphql-tag';

const shippingCost = gql`
    type ShippingCost {
        id: String
        fromKM: Float
        toKM: Float
        cost: Float
    },
    type ListShippingCost {
        offset: Int,
        limit: Int,
        total_shipping_cost : Int,
        list_shipping_cost: [ShippingCost]
    }
`;
export default shippingCost;