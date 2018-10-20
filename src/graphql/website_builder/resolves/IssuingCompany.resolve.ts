import { IssuingCompany } from '@private/models';
import { changeAlias } from '../../../helpers';
import Validate from '../../../helpers/validate';
import * as Joi from 'joi';
import * as _ from 'lodash';
import * as  escapeStringRegexp from 'escape-string-regexp';

export default {

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

            let filter: any = {is_active:true};

            if (args.search) {
                filter.$or = [
                    { name_slug: new RegExp(escapeStringRegexp(changeAlias(args.search)), 'gi') }
                ];
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
            let filter: any = {is_active:true};

            if (args.search) {
                filter.$or = [
                    { name_slug: new RegExp(escapeStringRegexp(changeAlias(args.search)), 'gi') }
                ];
            }

            return await IssuingCompany.find(filter).countDocuments();
        }
    }
};