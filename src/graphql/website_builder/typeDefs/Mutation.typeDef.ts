import gql from 'graphql-tag';

const mutation = gql`
    type Mutation {
        registerUser(
            user_name: String!
            email: String!
            name: String,
            phone_number: String!
            address: String,
        ): User

        updateUser(
            id: String!,
            name: String,
            phone_number: String,
            address: String,
        ):User
        
    }
`;
export default mutation;