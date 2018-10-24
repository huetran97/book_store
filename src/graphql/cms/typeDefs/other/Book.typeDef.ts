import gql from 'graphql-tag';

const book = gql`
    type Book {
        id: String
        name: String
        book_code: String,
        description: String
        author: Author
        rate: Float
        price: Float
        publisher: Publisher
        publication_date: Float
        language: Language,
        domain_knowledge: DomainKnowledge,
        subjects : ListSubject,
        size: String
        thumbnail: String,
        issuing_company: IssuingCompany
        print_length: Float
        cover_type: String,
        amount: Float,
        is_active: Boolean,
        book_store: [BookStore]
        total_sold: Float,
        historical_cost: Float

    },
    type ListBook {
        offset: Int,
        limit: Int,
        total_book : Int,
        list_book: [Book]
    }
`;
export default book;