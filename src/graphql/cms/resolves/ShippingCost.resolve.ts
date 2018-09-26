import { ShippingCost } from '@private/models';
import Validate from '../../../helpers/validate';
import * as Joi from 'joi';
import * as _ from 'lodash';

export default {
    Mutation: {
        addShippingCost: async (root, { type, cost }) => {
            let shipping_cost_data = new ShippingCost({
                type: type,
                cost: cost
            });
            return await shipping_cost_data.save();
        },
        updateShippingCost: async (root, { id, type, cost, is_active }) => {
            let update: any = {};

            if (type)
                update.type = type;


            if (cost)
                update.cost = cost;

            if (_.isBoolean(is_active))
                update.is_active = is_active;

            let shipping_cost_updated = await ShippingCost.findOneAndUpdate({ _id: id }, { $set: update }, { new: true });

            if (!shipping_cost_updated)
                throw new Error('Can not updated Shipping Cost');

            return shipping_cost_updated;
        },

        removeShippingCost: async (root, { id }) => {
            let shipping_cost_removed = await ShippingCost.findByIdAndRemove({ _id: id, is_active: true });

            if (!shipping_cost_removed)
                throw new Error('Can not remove Shipping Cost');

            return {
                message: 'Remove Shipping Cost successful'
            };
        }
    },
    Query: {
        shippingCost: async (root, { id }) => {
            return await ShippingCost.findOne({ _id: id });
        },
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