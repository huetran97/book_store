import { CmsGroup, Staff, StaffCmsGroup } from '@private/models';
import { sign } from 'jsonwebtoken';
import {
    ACCESS_TOKEN_WEB_EXPIRE_IN,
    ADMIN,
    JWT_SECRET,
    REFRESH_TOKEN_WEB_EXPIRE_IN,
    TOKEN_WEB_SALT
} from '@private/configs';
import { changeAlias, createHash } from '../../../helpers';
import Exception from '../../../exeptions/Exception';
import ExceptionCode from '../../../exeptions/ExceptionCode';
import * as _ from 'lodash';


export default {

    Mutation: {
        login: async (root, { user_name, password }) => {
            let staff_data;
            let permissions: string[] = [];


            staff_data = await Staff.findOne({
                user_name: changeAlias(user_name)
            });

            if (!staff_data)
                throw new Error('Staff not found');

            if (staff_data.password !== createHash('sha1', password + staff_data.salt))
                throw new Error('Wrong password!');

            if (staff_data.user_name.toString() === ADMIN) {

                CmsGroup.ALL_PERMISSIONS.map(function ({ value }) {
                    permissions.push(value);
                });

            } else {
                if (!staff_data) {
                    throw new Exception('Staff not found', ExceptionCode.STAFF_NOT_FOUND);
                }
                let manyStaffCMSGroupData = await StaffCmsGroup.find({
                    staff: staff_data._id
                });
                if (manyStaffCMSGroupData.length <= 0) {
                    throw new Exception('Permission denied', ExceptionCode.PERMISSION_DENIED);
                }


                for (let i = 0; i < manyStaffCMSGroupData.length; i++) {
                    let staffCMSGroupData = manyStaffCMSGroupData[i];
                    let cmsGroupData      = await CmsGroup.findOne({
                        _id: staffCMSGroupData.cms_group
                    });
                    permissions           = _.concat(permissions, cmsGroupData.permissions);
                }

                permissions = _.uniq(permissions);
            }


            let accessToken = sign({
                id: staff_data.id,
                salt: TOKEN_WEB_SALT
            }, JWT_SECRET, {
                expiresIn: ACCESS_TOKEN_WEB_EXPIRE_IN
            });

            let refreshToken = sign({
                id: staff_data.id,
                salt: TOKEN_WEB_SALT
            }, JWT_SECRET, {
                expiresIn: REFRESH_TOKEN_WEB_EXPIRE_IN
            });

            return {
                id: staff_data.id,
                access_token: accessToken,
                refresh_token: refreshToken,
                user_name: staff_data.user_name,
                sex: staff_data.sex,
                name: staff_data.name,
                avatar: staff_data.avatar,
                permissions:permissions
            };
        }
    }
};