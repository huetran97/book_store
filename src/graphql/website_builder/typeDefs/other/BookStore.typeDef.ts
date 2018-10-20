import gql from 'graphql-tag';

const bookStore = gql`
    type BookStore {
        id: String,
        store: Store,
        amount: Float
        is_active: Boolean
        quantity_sold: Float
    },
    type ListBookStore {
        total : Float,
        data: [BookStore]
    }


`;

export default bookStore;