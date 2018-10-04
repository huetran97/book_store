import { IssuingCompany } from '@private/models';
import { changeAlias } from '../../../helpers';
import Validate from '../../../helpers/validate';
import * as Joi from 'joi';
import * as _ from 'lodash';
import { escapeStringRegexp } from 'escape-string-regexp';

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
                throw new Error('Can not updated Store');

            return issuing_company_updated;
        },

        removeIssuingCompany: async (root, { id }) => {
            let issuing_company_removed = await IssuingCompany.findOneAndUpdate({
                _id: id,
                is_active: true
            }, { $set: { is_active: false } }, { new: true });

            if (!issuing_company_removed)
                throw new Error('Can not remove Issuing Company');

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
                    offset: Joi.number().integer().optional().min(0).default(0),
                    limit: Joi.number().integer().optional().min(5).default(20)
                }).validate();

            let filter: any = {};

            if (args.search) {
                filter.$or = [
                    { name_slug: new RegExp(escapeStringRegexp(changeAlias(args.search)), 'gi') }
                ];
            }

            if (_.isBoolean(args.is_active)) {
                filter.is_active = args.is_active;
            }

            let list = IssuingCompany
                .find(filter)
                .skip(args.offset)
                .limit(args.limit);

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
                    { name_slug: new RegExp(escapeStringRegexp(changeAlias(args.search)), 'gi') },
                ];
            }

            if (_.isBoolean(args.is_active)) {
                filter.is_active = args.is_active;
            }

            return await IssuingCompany.find(filter).countDocuments();
        }
    }
};