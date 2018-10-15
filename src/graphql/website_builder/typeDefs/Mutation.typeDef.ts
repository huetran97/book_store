import gql from 'graphql-tag';

const mutation = gql`
    type Mutation {
        registerUser(
            user_name: String!
            email: String!
            name: String,
            phone_number: String!
            password: String!
            address: String,
        ): User

        login(
            user_name: String!,
            password: String!,
        ): UserLogin

        updateUser(
            name: String,
            phone_number: String,
            address: String,
        ):User

        changeUserPassword(
            current_password: String!,
            new_password: String!
        ): User
        
        addBill(
            carts: [Cart!],
            shipping: String!,
            shipping_address: String!
        ): Bill

        addComment(
            book: String!,
            message: String!
        ): Comment

        addReportBook(
            book:String!,
            rate:String!,
            comment: String
        ):UserReportBook
    }

`;
export default mutation;