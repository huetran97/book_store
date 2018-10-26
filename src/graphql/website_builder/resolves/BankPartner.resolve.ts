import { BankPartner } from '@private/models';
import Validate from '../../../helpers/validate';
import * as Joi from 'joi';
import { changeAlias } from '../../../helpers';
import * as escapeStringRegexp from 'escape-string-regexp';
import * as _ from 'lodash';
import Exception from '../../../exeptions/Exception';
import ExceptionCode from '../../../exeptions/ExceptionCode';

export default {
    Query: {
        bankPartner: async (root, { id }) => {
            let bankPartnerData = await BankPartner.findOne({ _id: id });
            if (!bankPartnerData)
                throw new Exception('Bank  partner not found', ExceptionCode.BANK_PARTNER_NOT_FOUND);

            return bankPartnerData;
        },
        bankPartners: async (root, { offset, limit, search, is_acitve }) => {
            new Validate({ offset, limit })
                .joi({
                    offset: Joi.number().min(0),
                    limit: Joi.number().min(5).max(100)
                }).validate();

            let filter = [];

            if (search) {
                filter.push({
                    $or: [
                        { name: new RegExp(escapeStringRegexp(changeAlias(search)), 'gi') },
                        { api_url: new RegExp(escapeStringRegexp(changeAlias(search)), 'gi') },
                        { web_url: new RegExp(escapeStringRegexp(changeAlias(search)), 'gi') }
                    ]
                });
            }

            if (_.isBoolean(is_acitve))
                filter.push({
                    is_active: is_acitve
                });

            return {
                offset: offset,
                limit: limit,
                filter: filter.length === 0 ? {} : { $and: filter }
            };
        }
    },
    ListBankPartner: {
        total: async ({ filter }: { filter: any }, args, { dataloaders }) => {
            return await BankPartner.find(filter).countDocuments();
        },
        data: async ({ offset, limit, filter }: { offset: number, limit: number, filter: any }, data, { dataloaders }) => {
            return await BankPartner.find(filter).skip(offset).limit(limit).sort({ _id: -1 });
        }
    }
};