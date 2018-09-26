import gql from 'graphql-tag';

const staffCmsGroup = gql`
    type StaffCmsGroup {
        id: String
        staff: User
        cms_group: CmsGroup
    },
    type ListStaffCmsGroup {
        offset: Int,
        limit: Int,
        total_staff_cms_group : Int,
        list_staff_cms_group: [StaffCmsGroup]
    }
`;

export default staffCmsGroup;