import gql from 'graphql-tag';

const userLogin = gql`
    type UserLogin {
        id: String!
        user_name: String
        name: String
        email: String
        access_token: String!
        refresh_token: String!,
        permissions: [CMS_GROUP_PREMISSION]!

    }
`;
export default userLogin;