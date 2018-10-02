import gql from 'graphql-tag';

const ENUM = gql`
    enum COVER_TYPE {
        PAPERBACK
        HARDCOVER
        ENGLISH_BOOK
        VIETNAMESE_BOOK     
    },
    enum SEX{
        MALE,
        FEMALE
    }
    enum CMS_GROUP_PREMISSION {
        BOOK_MANAGER,
        STAFF_MANAGER,
        PUBLISHER_MANAGER,
        DEPARTMENT_MANAGER,
        ISSUING_COMPANY_MANAGER,
        STORE_MANAGER,
        CMS_GROUP_MANAGER,
        CMS_MANAGER}
`;

export default ENUM;
