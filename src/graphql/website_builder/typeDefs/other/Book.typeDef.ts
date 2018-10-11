import gql from 'graphql-tag';

const book = gql`
    type Book {
        id: String
        name: String
        book_code: String
        description: String
        author: Author
        rate: Float
        quantity_sold: Float
        price: Float
        publisher: Publisher
        publication_date: Float
        language: Language,
        domain_knowledge: DomainKnowledge,
        subjects : Subject,
        size: String
        issuing_company: IssuingCompany
        print_length: Float
        cover_type: String,
        store: Store
        is_active: Boolean,
        thumbnail:String,
        total_sold: Float,
    },
    type ListBook {
        offset: Int,
        limit: Int,
        total_book : Int,
        list_book: [Book]
    }
`;
export default book;