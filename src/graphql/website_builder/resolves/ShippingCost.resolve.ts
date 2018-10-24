import { ShippingCost } from '@private/models';
import Validate from '../../../helpers/validate';
import * as Joi from 'joi';
import * as _ from 'lodash';

export default {
    Query: {
        shippingCosts: async (root, args) => {
            args = new Validate(args)
                .joi({
                    offset: Joi.number().integer().optional().min(0).default(0),
                    limit: Joi.number().integer().optional().min(5).default(20)
                }).validate();

            let filter: any = {};

            if (_.isBoolean(args.is_active)) {
                filter.is_active = args.is_active;
            }

            let list = ShippingCost
                .find(filter)
                .skip(args.offset)
                .limit(args.limit);
            return {
                list_shipping_cost: await list,
                args
            };
        }
    },
    ListShippingCost: {
        total_shipping_cost: async ({ args }) => {
            let filter: any = {};

            if (_.isBoolean(args.is_active)) {
                filter.is_active = args.is_active;
            }

            return await ShippingCost.find(filter).countDocuments();
        }
    }

};