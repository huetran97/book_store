import { Purchase } from '@private/models';
import Validate from '../../../helpers/validate';
import * as Joi from 'joi';
import { User } from '@private/models/index';
import { escapeRegExp } from 'tslint/lib/utils';
import { changeAlias } from '../../../helpers';

export default {
    Query: {
        purchase: async (root, { id }) => {
            let purchase_data = await Purchase.findOne({ _id: id });
            if (!purchase_data)
                throw new Error('Purchase not found');

            return purchase_data;
        },
        purchases: async (root, args) => {
            args = new Validate(args)
                .joi({
                    offset: Joi.number().integer().optional().min(0).default(0),
                    limit: Joi.number().integer().optional().min(5).default(20)
                }).validate();

            let filter: any = {};


            if (args.search) {
                let user_id = await User.find({
                    $or: [
                        { name_slug: new RegExp(escapeRegExp(changeAlias(args.search)), 'gi') },
                        { phone_number: args.search }
                    ]
                }).distinct('_id');
                filter.$or  = [
                    { staff: { $in: { user_id } } },
                    { _id: args.search }
                ];
            }


            let list = Purchase
                .find(filter)
                .skip(args.offset)
                .limit(args.limit);

            return {
                list_purchase: await list,
                args
            };
        }
    }
};