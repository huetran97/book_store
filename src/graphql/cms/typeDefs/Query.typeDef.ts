import gql from 'graphql-tag';

const query = gql`
    type Query {
        user(
            id: String!
        ): User

        users(
            offset: Int,
            limit: Int,
            search: String,
            is_active: Boolean
        ): ListUser

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

        book(
            id: String!
        ): Book

        books(
            offset: Int,
            limit: Int,
            search: String,
            is_active: Boolean
        ): ListBook

        issuingCompany(
            id: String!
        ): IssuingCompany

        issuingCompanys(
            offset: Int,
            limit: Int,
            search: String,
            is_active: Boolean
        ): ListIssuingCompany

        languages(
            offset: Int,
            limit: Int,
            search: String,
            is_active: Boolean
        ): ListLanguage

        domainKnowledges(
            offset: Int,
            limit: Int,
            search: String,
            is_active: Boolean
        ): ListDomainKnowledge

        subjects(
            offset: Int,
            limit: Int,
            search: String,
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

        shippingCost(
            id: String!
        ): ShippingCost

        shippingCosts(
            offset: Int,
            limit: Int,
        ): ListShippingCost

        purchase(
            id: String!
        ): Purchase

        purchases(
            offset: Int,
            limit: Int,
            search: String
        ): ListPurchase

        shipingCost(
            id: String!
        ): ShippingCost

        shipingCosts(
            offset: Int,
            limit: Int,
        ): ListShippingCost
        
        cmsGroups: [CmsGroup]
        cmsGroup(
            id: String!
        ): CmsGroup


    }
`;
export default query;