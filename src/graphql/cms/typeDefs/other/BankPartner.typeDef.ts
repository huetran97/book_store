import gql from 'graphql-tag';

const bankPartner = gql`
    type BankPartner {
        id: String,
        name: String,
        icon_url: String,
        is_active: Boolean,
        api_key: String,
        api_secret: String,
        api_url: String,
        web_url: String,
        description: String,
    },
    type ListBankPartner {
        offset: Float,
        limit: Float,
        total: Float,
        data: [BankPartner]
    }
`;
export default bankPartner;