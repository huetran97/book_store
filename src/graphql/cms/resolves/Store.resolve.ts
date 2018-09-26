import { Store } from '@private/models';
import { changeAlias } from '../../../helpers';
import Validate from '../../../helpers/validate';
import * as Joi from 'joi';
import * as _ from 'lodash';
import { escapeRegExp } from 'tslint/lib/utils';

export default {
    Mutation: {
        addStore: async (root, { name, phone_number, address }) => {
            let store = new Store({
                name: name,
                name_slug: changeAlias(name),
                phone_number: phone_number,
                address: address
            });
            return await store.save();
        },
        updateStore: async (root, { id, name, phone_number, address, is_active }) => {
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

            let store_updated = await Store.findOneAndUpdate({ _id: id }, { $set: update }, { new: true });

            if (!store_updated)
                throw new Error('Can not updated Store');

            return store_updated;
        },

        removePublisher: async (root, { id }) => {
            let store_removed = await Store.findOneAndUpdate({
                _id: id,
                is_active: true
            }, { $set: { is_active: false } }, { new: true });

            if (!store_removed)
                throw new Error('Can not remove Store');

            return {
                message: 'Remove Publisher successful'
            };
        }
    },
    Query: {
        store: async (root, { id }) => {
            return await Store.findOne({ _id: id });
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
                    { name_slug: new RegExp(escapeRegExp(changeAlias(args.search)), 'gi') }
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
                    { name_slug: new RegExp(escapeRegExp(changeAlias(args.search)), 'gi') },
                ];
            }

            if (_.isBoolean(args.is_active)) {
                filter.is_active = args.is_active;
            }

            return await Store.find(filter).countDocuments();
        }
    }
};