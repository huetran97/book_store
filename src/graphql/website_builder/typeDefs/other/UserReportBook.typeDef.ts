import gql from 'graphql-tag';

const userReportBook = gql`
    type UserReportBook {
        id: String
        user: User
        book: Book
        rate: Float
        comment: String
        created_at: Float
        updated_at: Float
    },
    type ListUserReportBook{
        offset: Int,
        limit: Int,
        total_user_report_book : Int,
        list_user_report_book: [UserReportBook]
    }
`;

export default userReportBook;