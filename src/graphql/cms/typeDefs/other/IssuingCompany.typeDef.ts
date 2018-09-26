import gql from 'graphql-tag';

const issuingCompany = gql`
    type IssuingCompany {
        id: String
        name: String
        phone_number: String
        is_active: Boolean
        address: String,

    },
    type ListIssuingCompany {
        offset: Int,
        limit: Int,
        total_issuing_company : Int,
        list_issuing_company: [IssuingCompany]
    }
`;

export default issuingCompany;