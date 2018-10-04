import gql from 'graphql-tag';

const query = gql`
    directive @requireLogged (require: Boolean= true) on  FIELD_DEFINITION

    type Query {
        user: User
        @requireLogged

        book(id: String!): Book,
        books(offset: Int =0, limit: Int): ListBook

        carts: ListCard
        @requireLogged

        bill(id: String!): Bill
        @requireLogged
        bills(
            offset: Int,
            limit: Int,
        ): Bill
        @requireLogged

        comment(id: String!):Comment
        @requireLogged
        comments(book:String!):ListComment
        @requireLogged

        reportBook(id: String!): UserReportBook
        @requireLogged
        reportBooks(book: String!): ListUserReportBook
        @requireLogged

    }
`;
export default query;