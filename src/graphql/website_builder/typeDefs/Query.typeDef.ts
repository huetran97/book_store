import gql from 'graphql-tag';

const query = gql`
    directive @requireLogged (require: Boolean= true) on  FIELD_DEFINITION

    type Query {
        user: User
        @requireLogged

        book(id: String!): Book,
        books(offset: Int =0, limit: Int): ListBook

        shipingCost(
            id: String!
        ): ShippingCost

        shipingCosts(
            offset: Int,
            limit: Int,
        ): ListShippingCost

        issuingCompany(
            id: String!
        ): IssuingCompany

        issuingCompanys(
            offset: Int,
            limit: Int,
            search: String,
            is_active: Boolean
        ): ListIssuingCompany

        language(id: String!): Language

        languages(
            offset: Int,
            limit: Int,
            search: String,
            is_active: Boolean
        ): ListLanguage

        domainKnowledges(
            offset: Int,
            limit: Int,
            language: String,
            is_active: Boolean
        ): ListDomainKnowledge

        domainKnowledge(id: String!): DomainKnowledge

        subject(id: String!): Subject

        subjects(
            offset: Int,
            limit: Int,
            domain_knowledge: String,
            is_active: Boolean
        ): ListSubject

        event(
            id: String!
        ): Event

        events(
            offset: Int,
            limit: Int,
        ): ListEvent

        promotion(
            id: String!
        ): Promotion

        promotions(
            offset: Int,
            limit: Int,
        ): ListPromotion

        author(
            id: String!
        ): Author

        authors(
            offset: Int,
            limit: Int,
            search: String,
            is_active: Boolean
        ): ListAuthor

        publisher(
            id: String!
        ): Publisher

        publishers(
            offset: Int,
            limit: Int,
            search: String,
            is_active: Boolean
        ): ListPublisher

        store(
            id: String!
        ): Store

        stores(
            offset: Int,
            limit: Int,
            search: String,
            is_active: Boolean
        ): ListStore

        shippingCost(
            id: String!
        ): ShippingCost

        shippingCosts(
            offset: Int,
            limit: Int,
        ): ListShippingCost


        carts: ListCard
        @requireLogged

        bill(id: String!): Bill
        @requireLogged
        bills(
            offset: Int,
            limit: Int,
        ): Bill
        @requireLogged

        comment(id: String!):Comment
        @requireLogged
        comments(book:String!):ListComment
        @requireLogged

        reportBook(id: String!): UserReportBook
        @requireLogged
        reportBooks(book: String!): ListUserReportBook
        @requireLogged

    }
`;
export default query;