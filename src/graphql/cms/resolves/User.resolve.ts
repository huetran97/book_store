import { User } from '@private/models';
import Validate from '../../../helpers/validate';
import * as Joi from 'joi';
import { changeAlias, createHash, randomString } from '../../../helpers';
import * as _ from 'lodash';
import * as  escapeStringRegexp from 'escape-string-regexp';
import { DEFAULT_PASSWORD } from '../../../configs';
import Exception from '../../../exeptions/Exception';
import ExceptionCode from '../../../exeptions/ExceptionCode';

export default {
    Mutation: {
        addUser: async (root, { user_name, name, phone_number, address, email }) => {
            let salt     = randomString(20);
            let password = createHash('sha1', DEFAULT_PASSWORD + salt);
            let user     = new User({
                user_name: user_name,
                name: name,
                email: changeAlias(email),
                salt: salt,
                password: password,
                name_slug: changeAlias(name),
                phone_number: phone_number,
                address: address
            });

            return await user.save();
        },

        updateUser: async (root, { id, name, phone_number, address, is_active, email }) => {

            let user_data = await User.findOne({ _id: id });

            if (!user_data)
                throw new Exception('User not found', ExceptionCode.USER_NOT_FOUND);

            if (name) {
                user_data.name      = name;
                user_data.name_slug = changeAlias(name);
            }

            if (email) {
                user_data.email = changeAlias(email);
            }

            if (phone_number)
                user_data.phone_number = phone_number;

            if (address)
                user_data.address = address;

            if (_.isBoolean(is_active))
                user_data.is_active = is_active;

            await user_data.save();

            return user_data;
        },

        removeUser: async (root, { id }) => {
            let user_remove = await User.findOneAndUpdate({
                _id: id,
                $or:[
                    { is_active: true },
                    {is_active: null}
                ]
            }, { $set: { is_active: false } }, { new: true });

            if (!user_remove)
                throw new Exception('Can not remove user', ExceptionCode.CAN_NOT_REMOVE_USER);

            return {
                message: 'Remove user successful'
            };
        }

    },
    Query: {
        user: async (root, { id }) => {
            return await User.findOne({ _id: id });
        },
        users: async (root, args) => {
            args = new Validate(args)
                .joi({
                    offset: Joi.number().integer().optional().min(0),
                    limit: Joi.number().integer().optional().min(5)
                }).validate();

            let filter: any = {};

            if (args.search) {
                filter.$or = [
                    { name_slug: new RegExp(escapeStringRegexp(changeAlias(args.search)), 'gi') },
                    { phone_number: new RegExp(escapeStringRegexp(args.search), 'gi') },
                    { email: new RegExp(escapeStringRegexp(args.search), 'gi') }
                ];
            }

            if (_.isBoolean(args.is_active)) {
                filter.$or = [
                    { is_active: args.is_active },
                    { is_active: null }
                ];
            }

            let list = User
                .find(filter);

            if (args.offset)
                list.skip(args.offset);
            if (args.limit)
                list.skip(args.limit);

            return {
                list_user: await list,
                args
            };
        }
    },
    ListUser: {
        total_user: async ({ args }) => {
            let filter: any = {};

            if (args.search) {
                filter.$or = [
                    { name_slug: new RegExp(escapeStringRegexp(changeAlias(args.search)), 'gi') },
                    { phone_number: new RegExp(escapeStringRegexp(args.search), 'gi') },
                    { email: new RegExp(escapeStringRegexp(args.search), 'gi') }
                ];
            }

            if (_.isBoolean(args.is_active)) {
                filter.is_active = args.is_active;
            }


            return await User.find(filter).countDocuments();
        }
    }
};