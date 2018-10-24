import gql from 'graphql-tag';

const store = gql`
    type Store {
        id: String,
        name: String,
        phone_number: String,
        address: String,
        total_staff:Float,
        total_book: Float,
        books: [Book],
        latitude: Float,
        longitude: Float,
        staffs: [Staff],
        is_active: Boolean
    },
    type ListStore {
        offset: Int,
        limit: Int,
        total_store: Int,
        list_store: [Store]
    }
`;
export default store;