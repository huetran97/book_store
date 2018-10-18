import gql from 'graphql-tag';

const distance = gql`
    type Distance {
        distance: Float,
        shippingCost: ShippingCost
    }
`;
export default distance;