import { CmsGroup, StaffCmsGroup, User } from '@private/models';
import Validate, { isMongoObjectId } from '../../../helpers/validate';
import Exception from '../../../exeptions/Exception';
import ExceptionCode from '../../../exeptions/ExceptionCode';

export default {
    Query: {
        cmsGroups: async () => {
            return await CmsGroup.find({}).sort({ _id: -1 });
        },

        cmsGroup: async (root, { id }) => {
            new Validate({ id })
                .joi({
                    id: isMongoObjectId()
                }).validate();

            let data = await CmsGroup.findOne({ _id: id });
            if(!data)
                throw new Exception('Cms group not found', ExceptionCode.CMS_GROUP_NOT_FOUND)
        }
    },
    Mutation: {
        addCmsGroup: async (root, { name, permissions }) => {
            let newCmsGroup = new CmsGroup({
                name: name,
                permissions: permissions
            });

            return await newCmsGroup.save();
        },

        updateCmsGroup: async (root, { cms_group_id, name, permissions }) => {
            new Validate({ cms_group_id })
                .joi({
                    cms_group_id: isMongoObjectId()
                }).validate();

            let update: any = {};

            if (name)
                update.name = name;

            if (permissions)
                update.permissions = permissions;

            let cmsGroupUpdated = await CmsGroup.findOneAndUpdate({ _id: cms_group_id }, { $set: update }, { new: true });

            if (!cmsGroupUpdated)
                throw new Exception('Can not update cms group!', ExceptionCode.CAN_NOT_UPDATE_CMS_GROUP);

            return cmsGroupUpdated;
        }
    },

    CmsGroup: {
        staff_count: async ({ id }) => {
            return await StaffCmsGroup.find({
                cms_group: id
            }).countDocuments();
        },

        list_staff_cms_group: async ({ id }) => {
            return await StaffCmsGroup.find({
                cms_group: id
            });
        }

    },
    StaffCmsGroup: {
        staff: async (cms) => {
            return await User.findOne({ _id: cms.staff });
        },
        cms_group: async (cms) => {
            return await CmsGroup.findOne({ _id: cms.cms_group });
        }
    }
};