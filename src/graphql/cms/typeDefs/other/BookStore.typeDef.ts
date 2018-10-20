import gql from 'graphql-tag';

const bookStore = gql`
    type BookStore {
        id: String,
        book: Book,
        store: Store,
        amount: Float
        is_active: Boolean
        quantity_sold: Float
        created_at: Float
        updated_at: Float
    },

    
`;

export default bookStore;