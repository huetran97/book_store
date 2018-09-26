import gql from 'graphql-tag';

const language = gql`
    type Language {
        id: String,
        name: String
    },
    type ListLanguage {
        offset: Int,
        limit: Int,
        total_language : Int,
        list_language: [Language]
    }
`;

export default language;