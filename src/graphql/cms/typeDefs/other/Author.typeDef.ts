import gql from 'graphql-tag';

const author = gql`
    type Author {
        id: String
        name: String
        is_active: Boolean
        description: String
    },
    type ListAuthor {
        offset: Int,
        limit: Int,
        total_author: Int,
        list_author: [Author]
    }
`;
export default author;