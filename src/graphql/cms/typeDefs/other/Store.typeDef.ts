import gql from 'graphql-tag';

const store = gql`
    type Store {
        id: String,
        name: String,
        phone_number: String,
        address: String,
        total_staff:Float,
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