import gql from 'graphql-tag';

const cmsGroup = gql`
    type CmsGroup {
        id: String
        name: String!
        permissions: [CMS_GROUP_PREMISSION]!
        staff_count: Float!
        list_staff_cms_group: [StaffCmsGroup]!
    },
    type ListCmsGroup {
        offset: Int,
        limit: Int,
        total_cms_group : Int,
        list_cms_group: [CmsGroup]
    }
`;

export default cmsGroup;