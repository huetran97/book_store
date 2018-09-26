import gql from 'graphql-tag';

const publisher = gql`
    type Publisher {
        id: String,
        name: String,
        phone_number: String,
        is_active: Boolean,
        address: String,
    },
    type ListPublisher {
        offset: Int,
        limit: Int,
        total_publisher: Int,
        list_publisher: [Publisher]
    }
`;
export default publisher;