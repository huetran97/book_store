import gql from 'graphql-tag';

const mutation = gql`
    type Mutation {
        addUser(
            user_name: String!
            email: String!
            name: String,
            phone_number: String!
            address: String,
        ): User

        updateUser(
            id: String!,
            name: String,
            email: String
            phone_number: String,
            address: String,
            is_active: Boolean
        ):User

        removeUser(
            id: String!
        ): StringMessage


        addStaff(
            user_name: String!,
            email: String!
            date_of_birth: Float,
            sex: SEX,
            id_card_number: String,
            id_card_number_date: Float,
            id_card_number_location: String,
            tax_number: String,
            insurrance_number: String,
            start_work_date: Float!,
            end_work_date: Float,
            name: String!,
            phone_number: String!,
            role: String!,
            store: String!
            address: String,
        ): Staff

        updateStaff(
            id: String!,
            user_name: String,
            email: String,
            date_of_birth: Float,
            sex: SEX,
            id_card_number: String,
            id_card_number_date: Float,
            id_card_number_location: String,
            tax_number: String,
            insurrance_number: String,
            start_work_date: Float,
            end_work_date: Float,
            name: String,
            phone_number: String,
            store: String,
            role: String,
            address: String,
            is_active: Boolean
        ):Staff

        removeStaff(
            id: String!
        ): StringMessage

        addStore(
            name: String!
            phone_number: String!
            address: String!
        ): Store

        updateStore(
            id: String!,
            name: String,
            phone_number: String,
            is_active: Boolean
            address: String
        ): Store

        removeStore(
            id: String!
        ): StringMessage

        addAuthor(
            name: String!
            description: String
        ): Author

        updateAuthor(
            id: String!,
            name: String
            is_active: Boolean
            description: String
        ): Author

        removeAuthor(
            id: String!
        ): StringMessage

        addPublisher(
            name: String!
            phone_number: String!
            address: String
        ): Publisher

        updatePublisher(
            id: String!,
            name: String,
            phone_number: String,
            is_active: Boolean
            address: String
        ): Publisher

        removePublisher(
            id: String!
        ): StringMessage

        addIssuingCompany(
            name: String!
            phone_number: String!
            address: String
        ): IssuingCompany

        updateIssuingCompany(
            id: String!,
            name: String,
            phone_number: String,
            address: String
            is_active: Boolean
        ): IssuingCompany

        removeIssuingCompany(
            id: String!
        ): StringMessage

        addLanguage(
            name: String!
        ): Language

        updateLanguage(
            id: String!,
            name: String,
            is_active: Boolean
        ): Language

        removeLanguage(
            id: String!
        ): StringMessage

        addDomainKnowledge(
            name: String!
            language: String!
        ): DomainKnowledge

        updateDomainKnowledge(
            id: String!,
            name: String,
            language: String,
            is_active: Boolean
        ): DomainKnowledge

        removeDomainKnowledge(
            id: String!
        ): StringMessage

        addSubject(
            name: String!,
            domain_knowledge: String!
        ): Subject

        updateSubject(
            id: String!,
            name: String,
            domain_knowledge: String
            is_active: Boolean
        ): Subject

        removeSubject(
            id: String!
        ): StringMessage

        addBook(
            name: String!,
            book_code: String!
            description: String,
            author: String!,
            price: Float!,
            historical_cost: Float!,
            publisher: String!,
            publication_date: Float,
            language: String!,
            domain_knowledge: String!,
            subjects: [String!],
            size: String,
            thumbnail: String,
            issuing_company: String!,
            print_length: Int,
            amount: Float!,
            cover_type: COVER_TYPE,
        ):Book

        updateBook(
            id: String!
            book_code: String
            name: String,
            description: String,
            author: String,
            price: Float,
            historical_cost: Float,
            publisher: String,
            publication_date: Float,
            language: String,
            domain_knowledge: String,
            subjects: [String],
            size: String,
            thumbnail: String,
            issuing_company: String,
            amount: Float,
            print_length: Int,
            cover_type: COVER_TYPE,
            is_active: Boolean
        ):Book

        removeBook(
            id: String!
        ): StringMessage

        addBookStore(
            book: String!,
            store: String!
            amount: Float!
        ): BookStore

        updateBookStore(
            id: String!,
            book: String,
            store: String,
            is_active: Boolean
            amount: Float
        ): BookStore

        addEvent(
            title: String!
            description: String
            thumbnail: String
            content: String
            begin_time: Float
            end_time: Float
        ): Event

        updateEvent(
            id: String!,
            description: String
            thumbnail: String
            content: String
            begin_time: Float
            end_time: Float
        ): Event

        removeEvent(
            id: String!
        ): StringMessage

        addPromotion(
            book: String!
            event: String!
            discount: Float!
        ): Event

        updatePromotion(
            id: String!
            book: String
            event: String
            discount: Float
        ): Event

        login(
            user_name: String!,
            password: String!,
        ): UserLogin
        
        removePromotion(
            id: String!
        ): StringMessage

        addShippingCost(
            fromKM: Float!,
            toKM: Float!
            cost: Float!,
        ): ShippingCost

        updateShippingCost(
            id: String
            fromKM: Float,
            toKM: Float
            cost: Float,
            is_active: Boolean
        ): ShippingCost

        removeShippingCost(
            id: String!
        ): StringMessage

        addCmsGroup(
            name: String!,
            permissions: [CMS_GROUP_PREMISSION]!
        ): CmsGroup!

        updateCmsGroup(
            cms_group_id: String!,
            name: String,
            permissions: [CMS_GROUP_PREMISSION]
        ): CmsGroup!

        addStaffCmsGroup(
            cms_group_id: String!,
            email_staff: String!
        ): StaffCmsGroup!


        removeStaffCmsGroup(
            staff_cms_group_id: String!
        ): StringMessage!
        
        addBankPartner (
            name: String!,
            icon_url: String,
            api_url: String!,
            api_secret: String!
            api_key: String!,
            web_url: String!,
            description: String
        ): BankPartner

        updateBankPartner(
            id: String!,
            name: String,
            icon_url: String,
            api_url: String,
            api_secret: String,
            api_key: String,
            web_url: String,
            is_active: Boolean,
            description: String
        ): BankPartner

        removeBankPartner(
            id: String!
        ): StringMessage

        updateBill(
            id: String!,
            status: STATUS_BILL
        ):Bill

    }
`;
export default mutation;