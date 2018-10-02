import gql from 'graphql-tag';

const query = gql`
    type Query {
        user(
            id: String!
        ): User
        
        carts: ListCard
        
        bill(id: String!): Bill
        bills(
            offset: Int,
            limit: Int,
        ): Bill
        
        comment(id: String!):Comment
        comments(book:String!):ListComment
        
        reportBook(id: String!): UserReportBook
        reportBooks(book: String!): ListUserReportBook
        
    }
`;
export default query;