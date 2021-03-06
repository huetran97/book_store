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

        staff(
            id: String!
        ): Staff

        staffs(
            offset: Int,
            limit: Int,
            search: String,
            is_active: Boolean
        ): ListStaff

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
            store: String,
            is_hot_sale: Boolean,
            is_newest: Boolean,
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

        shippingCost(
            id: String!
        ): ShippingCost

        shippingCosts(
            offset: Int,
            limit: Int,
        ): ListShippingCost

        bill(
            id: String!
        ): Bill

        bills(
            offset: Int,
            limit: Int,
            search: String
        ): ListBill
        
        
        cmsGroups: [CmsGroup]
        cmsGroup(
            id: String!
        ): CmsGroup


        costOfGoodsSold(
            from_date: Float,
            to_date: Float
        ): CostOfGoodsSold,

        goodsSale(
            from_date: Float,
            to_date: Float
        ): GoodsSale,
        
        grossProfit(
            from_date: Float,
            to_date: Float
        ): GrossProfit

       bankPartner(id: String!): BankPartner
       
        """
        Search name, web_url, api_url
        """
       bankPartners(offset: Float =0, limit: Float, search: String, is_active: Boolean): ListBankPartner
        


    }
`;
export default query;