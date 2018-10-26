import { IssuingCompany } from '@private/models';
import { changeAlias } from '../../../helpers';
import Validate from '../../../helpers/validate';
import * as Joi from 'joi';
import * as _ from 'lodash';
import * as  escapeStringRegexp from 'escape-string-regexp';
import Exception from '../../../exeptions/Exception';
import ExceptionCode from '../../../exeptions/ExceptionCode';

export default {
    Mutation: {
        addIssuingCompany: async (root, { name, phone_number, address }) => {
            let issuing_company = new IssuingCompany({
                name: name,
                name_slug: changeAlias(name),
                phone_number: phone_number,
                address: address
            });
            return await issuing_company.save();
        },
        updateIssuingCompany: async (root, { id, name, phone_number, address, is_active }) => {
            let update: any = {};

            if (name) {
                update.name      = name;
                update.name_slug = changeAlias(name);
            }

            if (phone_number)
                update.phone_number = phone_number;

            if (address)
                update.address = address;

            if (_.isBoolean(is_active))
                update.is_active = is_active;

            let issuing_company_updated = await IssuingCompany.findOneAndUpdate({ _id: id }, { $set: update }, { new: true });

            if (!issuing_company_updated)
                throw new Exception('Can not updated Issuing company', ExceptionCode.CAN_NOT_UPDATE_ISSUING_COMPANY);

            return issuing_company_updated;
        },

        removeIssuingCompany: async (root, { id }) => {
            let issuing_company_removed = await IssuingCompany.findOneAndUpdate({
                _id: id,
                $or:[
                    { is_active: true },
                    {is_active: null}
                ]
            }, { $set: { is_active: false } }, { new: true });

            if (!issuing_company_removed)
                throw new Exception('Can not remove Issuing Company', ExceptionCode.CAN_NOT_REMOVE_ISSUING_COMPANY);

            return {
                message: 'Remove Issuing Company successful'
            };
        }
    },
    Query: {
        issuingCompany: async (root, { id }) => {
            return await IssuingCompany.findOne({ _id: id });
        },
        issuingCompanys: async (root, args) => {
            args = new Validate(args)
                .joi({
                    offset: Joi.number().integer().optional().min(0),
                    limit: Joi.number().integer().optional().min(5)
                }).validate();

            let filter: any = {};

            if (args.search) {
                filter.$or = [
                    { name_slug: new RegExp(escapeStringRegexp(changeAlias(args.search)), 'gi') }
                ];
            }

            if (_.isBoolean(args.is_active)) {
                filter.$or = [
                    { is_active: args.is_active },
                    { is_active: null }
                ];
            }

            let list = IssuingCompany
                .find(filter);


            if (args.offset)
                list.skip(args.offset);
            if (args.limit)
                list.skip(args.limit);

            return {
                list_issuing_company: await list,
                args
            };
        }
    },
    ListIssuingCompany: {
        total_issuing_company: async ({ args }) => {
            let filter: any = {};

            if (args.search) {
                filter.$or = [
                    { name_slug: new RegExp(escapeStringRegexp(changeAlias(args.search)), 'gi') }
                ];
            }

            if (_.isBoolean(args.is_active)) {
                filter.is_active = args.is_active;
            }

            return await IssuingCompany.find(filter).countDocuments();
        }
    }
};