import gql from 'graphql-tag';

const user = gql`
    type User {
        id: String,
        user_name: String,
        email: String
        name: String,
        phone_number: String,
        is_active: Boolean,
        address: String,
        last_login: Float,
    },
    type ListUser {
        offset: Int,
        limit: Int,
        total_user: Int,
        list_user: [User]
    }
`;
export default user;