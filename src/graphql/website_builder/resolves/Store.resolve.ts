import { Store } from '@private/models';
import { changeAlias } from '../../../helpers';
import Validate from '../../../helpers/validate';
import * as Joi from 'joi';
import * as _ from 'lodash';
import * as  escapeStringRegexp from 'escape-string-regexp';
import Exception from '../../../exeptions/Exception';
import ExceptionCode from '../../../exeptions/ExceptionCode';

export default {

    Query: {
        store: async (root, { id }) => {
            let store = await Store.findOne({ _id: id });
            if (!store)
                throw new Exception('Store not found', ExceptionCode.STORE_NOT_FOUND);

            return store;
        },
        stores: async (root, args) => {
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

            let list = Store
                .find(filter)
                .skip(args.offset)
                .limit(args.limit);

            return {
                list_store: await list,
                args
            };
        }
    },
    ListStore: {
        total_store: async ({ args }) => {
            let filter: any = {};

            if (args.search) {
                filter.$or = [
                    { name_slug: new RegExp(escapeStringRegexp(changeAlias(args.search)), 'gi') }
                ];
            }

            if (_.isBoolean(args.is_active)) {
                filter.is_active = args.is_active;
            }

            return await Store.find(filter).countDocuments();
        }
    }
};