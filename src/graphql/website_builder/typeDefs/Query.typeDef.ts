import gql from 'graphql-tag';

const query = gql`
    directive @requireLogged (require: Boolean= true) on  FIELD_DEFINITION

    type Query {
        user: User
        @requireLogged

        book(book: String!): Book,
        books(offset: Int =0, limit: Int, store:String, search: String, is_hot_sale:Boolean, is_newest: Boolean): ListBook

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
        ): ListIssuingCompany

        language(id: String!): Language

        languages(
            offset: Int,
            limit: Int,
            search: String,
        ): ListLanguage

        domainKnowledges(
            offset: Int,
            limit: Int,
            language: String,
        ): ListDomainKnowledge

        domainKnowledge(id: String!): DomainKnowledge

        subject(id: String!): Subject

        subjects(
            offset: Int,
            limit: Int,
            domain_knowledge: String,
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
        ): ListAuthor

        publisher(
            id: String!
        ): Publisher

        publishers(
            offset: Int,
            limit: Int,
            search: String,
        ): ListPublisher

        store(
            id: String!
        ): Store

        stores(
            offset: Int,
            limit: Int,
            search: String,
        ): ListStore

        shippingCosts(
            offset: Int,
            limit: Int,
        ): ListShippingCost
        

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
        
        distance(store: String!, address:String!): ReportShippingCost
        @requireLogged

        bankPartner(id: String!): BankPartner,
        @requireLogged
        """
        Search name, web_url, api_url
        """
        bankPartners(offset: Float =0, limit: Float, search: String): ListBankPartner
        @requireLogged
    }
`;
export default query;