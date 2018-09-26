import gql from 'graphql-tag';

const query = gql`
    type Query {
        user(
            id: String!
        ): User
        
    }
`;
export default query;