import gql from 'graphql-tag';

const promotion = gql`
    type Promotion {
        id: String
        book: Book
        event: Event
        discount: Float,
        begin_date: Float,
        end_date: Float,
    },
    type ListPromotion{
        offset: Int,
        limit: Int,
        total_promotion : Int,
        list_promotion: [Promotion]
    }
`;

export default promotion;