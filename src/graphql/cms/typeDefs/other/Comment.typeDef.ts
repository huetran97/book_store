import gql from 'graphql-tag';

const comment = gql`
    type Comment {
        id: String
        user: User
        book: Book
        message: String
        created_at: Float
        updated_at: Float
    },
    type ListComment {
        offset: Int,
        limit: Int,
        total_comment : Int,
        list_comment: [Comment]
    }
`;

export default comment;