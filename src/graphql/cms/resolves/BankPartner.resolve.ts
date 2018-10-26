import { BankPartner } from '@private/models';
import * as _ from 'lodash';
import Validate from '../../../helpers/validate';
import * as Joi from 'joi';
import { changeAlias } from '../../../helpers';
import * as escapeStringRegexp from 'escape-string-regexp';
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
        bankPartners: async (root, { offset, limit, search, is_active }) => {
            new Validate({ offset, limit })
                .joi({
                    offset: Joi.number().min(0),
                    limit: Joi.number().min(5).max(50)
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

            if (_.isBoolean(is_active))
                filter.push({
                    is_active: is_active
                });

            return {
                offset: offset,
                limit: limit,
                filter: filter.length === 0 ? {} : { $and: filter }
            };
        }
    },
    Mutation: {
        addBankPartner: async (root, { name, icon_url, api_url, web_url, description, api_secret, api_key }) => {
            let bankPartner = new BankPartner({
                name: name,
                icon_url: icon_url,
                api_url: api_url,
                web_url: web_url,
                api_secret: api_secret,
                api_key: api_key,
                description: description
            });
            return await bankPartner.save();
        },

        updateBankPartner: async (root, { id, name, icon_url, api_url, web_url, description, is_active, api_key, api_secret }) => {
            let update: any = {};

            if (name)
                update.name = name;

            if (icon_url)
                update.icon_url = icon_url;

            if (api_url)
                update.api_url = api_url;

            if (api_key)
                update.api_key = api_key;

            if (api_secret)
                update.api_secret = api_secret;

            if (web_url)
                update.web_url = web_url;

            if (description)
                update.description = description;

            if (_.isBoolean(is_active))
                update.is_active = is_active;


            let bankPartnerUpdated = await BankPartner.findOneAndUpdate({ _id: id }, { $set: update }, { new: true });

            if (!bankPartnerUpdated)
                throw new Exception('Can not update Bank partner', ExceptionCode.CAN_NOT_UPDATE_BANK_PARTNER);

            return bankPartnerUpdated;
        },

        removeBankPartner: async (root, { id }) => {
            let bankPartnerRemoved = await BankPartner.findOneAndUpdate({
                _id: id,
                $or:[
                    { is_active: true },
                    {is_active: null}
                ]
            }, { $set: { is_active: false } }, { new: true });

            if (!bankPartnerRemoved)
                throw new Exception('Can not remove Bank Partner', ExceptionCode.CAN_NOT_REMOVE_BANK_PARTNER);

            return {
                message: 'Remove bank partner successful'
            };
        }
    },
    ListBankPartner: {
        total: async ({ filter }: { filter: any }, args, { dataloaders }) => {
            return await BankPartner.find(filter).countDocuments();
        },
        data: async ({ offset, limit, filter }: { offset: number, limit: number, filter: any }, data, { dataloaders }) => {
            return await BankPartner.find(filter).sort({ _id: -1 });
        }
    }
};