import gql from 'graphql-tag';

const bankPartner = gql`
    type BankPartner {
        id: String,
        name: String,
        icon_url: String,
        is_acitve: Boolean,
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