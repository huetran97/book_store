import gql from 'graphql-tag';

const staff = gql`
    type Staff {
        id: String,
        user_name: String,
        email: String
        date_of_birth: Float,
        sex: SEX,
        id_card_number: String,
        id_card_number_date: Float,
        id_card_number_location: String,
        tax_number: String,
        insurrance_number: String,
        start_work_date: Float,
        end_work_date: Float,
        name: String,
        phone_number: String,
        store: Store
        is_active: Boolean,
        address: String,
        last_login: Float,
    },
    type ListStaff {
        offset: Int,
        limit: Int,
        total_staff: Int,
        list_staff: [Staff]
    }
`;
export default staff;