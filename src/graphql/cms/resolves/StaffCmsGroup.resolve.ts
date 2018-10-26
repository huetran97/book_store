import { CmsGroup, Staff, StaffCmsGroup } from '@private/models';
import Validate, { isMongoObjectId } from '../../../helpers/validate';
import * as Joi from 'joi';
import Exception from '../../../exeptions/Exception';
import ExceptionCode from '../../../exeptions/ExceptionCode';


export default {
    Query: {},
    Mutation: {
        addStaffCmsGroup: async (root, { cms_group_id, email_staff }) => {
            new Validate({ cms_group_id, email_staff })
                .joi({
                    cms_group_id: isMongoObjectId(),
                    email_staff: Joi.string().email()
                }).validate();

            let staffData = await Staff.findOne({
                email: email_staff,
                $or:[
                    { is_active: true },
                    {is_active: null}
                ]
            });

            if (!staffData)
                throw new Exception('Staff not found!', ExceptionCode.STAFF_NOT_FOUND);

            let staffCMSGroupData = await StaffCmsGroup.findOne({
                cms_group: cms_group_id,
                staff: staffData._id
            });
            if (staffCMSGroupData)
                throw new Exception('Staff is exist in Cms Group', ExceptionCode.STAFF_IS_EXIST_IN_CMS_GROUP);

            let newStaffCMSGroup = new StaffCmsGroup({
                cms_group: cms_group_id,
                staff: staffData._id
            });

            return await newStaffCMSGroup.save();
        },
        removeStaffCmsGroup: async (root, { staff_cms_group_id }) => {
            new Validate({ staff_cms_group_id })
                .joi({
                    staff_cms_group_id: isMongoObjectId()
                }).validate();

            let staffCMSGroup = await StaffCmsGroup.findOne({ _id: staff_cms_group_id });

            if (!staffCMSGroup)
                throw new Exception('Staff cms group not found!', ExceptionCode.STAFF_CMS_GROUP_NOT_FOUND);

            return {
                message: 'Remove Staff CMS Group successful'
            };
        }
    },
    StaffCmsGroup: {
        cms_group: async (staffCMSGroupData) => {
            return await CmsGroup.findOne({ _id: staffCMSGroupData.cms_group });
        },
        staff: async (staffCMSGroupData) => {
            return await Staff.findOne({ _id: staffCMSGroupData.staff });
        }
    }
};