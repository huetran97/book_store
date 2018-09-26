import gql from 'graphql-tag';

const book = gql`
    type Book {
        id: String
        name: String
        description: String
        author: Author
        rate: Float
        quantity_sold: Float
        price: Float
        publisher: Publisher
        publication_date: Float
        language: Language,
        domain_knowledge: DomainKnowledge,
        subject : Subject,
        size: String
        issuing_company: IssuingCompany
        print_length: Float
        cover_type: String,
        store: Store
        amount: Float,
        is_active: Boolean
    },
    type ListBook {
        offset: Int,
        limit: Int,
        total_book : Int,
        list_book: [Book]
    }
`;
export default book;