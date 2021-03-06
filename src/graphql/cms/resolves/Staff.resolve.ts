import { Staff, Store } from '@private/models';
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
        addStaff: async (root, {
            user_name, email, date_of_birth, sex, id_card_number, id_card_number_date, id_card_number_location,
            tax_number, insurrance_number, start_work_date, end_work_date, name, phone_number, store, address,
            role
        }) => {
            let salt     = randomString(20);
            let password = createHash('sha1', DEFAULT_PASSWORD + salt);
            let staff    = new Staff({
                user_name: user_name,
                email: email,
                date_of_birth: date_of_birth,
                sex: sex,
                password: password,
                id_card_number: id_card_number,
                id_card_number_date: id_card_number_date,
                id_card_number_location: id_card_number_location,
                tax_number: tax_number,
                insurrance_number: insurrance_number,
                start_work_date: start_work_date,
                end_work_date: end_work_date,
                name: name,
                salt: salt,
                role: role,
                phone_number: phone_number,
                store: store,
                address: address
            });

            return await staff.save();
        },

        updateStaff: async (root, {
            id, email, date_of_birth, sex, id_card_number, id_card_number_date, id_card_number_location,
            role,
            tax_number, insurrance_number, start_work_date, end_work_date, name, phone_number, store, address, is_active
        }) => {

            let staff_data = await Staff.findOne({ _id: id });

            if (!staff_data)
                throw new Exception('Staff not found', ExceptionCode.STAFF_NOT_FOUND);

            if (name) {
                staff_data.name      = name;
                staff_data.name_slug = changeAlias(name);
            }

            if (email) {
                staff_data.email = changeAlias(email);
            }

            if (date_of_birth)
                staff_data.date_of_birth = date_of_birth;

            if (role)
                staff_data.role = role;

            if (sex)
                staff_data.sex = sex;

            if (id_card_number)
                staff_data.id_card_number = id_card_number;

            if (id_card_number_date)
                staff_data.id_card_number_date = id_card_number_date;

            if (id_card_number_location)
                staff_data.id_card_number_location = id_card_number_location;

            if (tax_number)
                staff_data.tax_number = tax_number;

            if (insurrance_number)
                staff_data.insurrance_number = insurrance_number;

            if (start_work_date)
                staff_data.start_work_date = start_work_date;

            if (end_work_date >= 0)
                staff_data.end_work_date = end_work_date;

            if (store) {
                let store_data = await Store.findOne({ _id: store });
                if (!store_data)
                    throw new Exception('Store not found', ExceptionCode.STORE_NOT_FOUND);
                staff_data.store = store;
            }

            if (phone_number)
                staff_data.phone_number = phone_number;

            if (address)
                staff_data.address = address;

            if (_.isBoolean(is_active))
                staff_data.is_active = is_active;

            await staff_data.save();

            return staff_data;
        },

        removeStaff: async (root, { id }) => {
            let user_remove = await Staff.findOneAndUpdate({
                _id: id,
                $or:[
                    { is_active: true },
                    {is_active: null}
                ]
            }, { $set: { is_active: false } }, { new: true });

            if (!user_remove)
                throw new Exception('Can not remove Staff', ExceptionCode.CAN_NOT_REMOVE_STAFF);

            return {
                message: 'Remove Staff successful'
            };
        }

    },
    Query: {
        staff: async (root, { id }) => {
            return await Staff.findOne({ _id: id });
        },
        staffs: async (root, args) => {
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

            let list = Staff
                .find(filter);

            if (args.offset)
                list.skip(args.offset);
            if (args.limit)
                list.skip(args.limit);

            return {
                list_staff: await list,
                args
            };
        }
    },
    Staff: {
        store: async (staff) => {
            return await Store.findOne({ _id: staff.store });
        }
    },
    ListStaff: {
        total_staff: async ({ args }) => {
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


            return await Staff.find(filter).countDocuments();
        }
    }
};