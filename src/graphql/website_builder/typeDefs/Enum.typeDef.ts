import gql from 'graphql-tag';

const ENUM = gql`
    enum PAYMENT_TYPE{
        CREDIT_CARD,
        COD
    }
    enum DEGREE_TYPE {
        UNIVERSITY,
        COLLEGE,
        VOCATIONAL_SCHOOL,
        HIGH_SCHOOL
    },
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
