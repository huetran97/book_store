import { Publisher } from '@private/models';
import { changeAlias } from '../../../helpers';
import Validate from '../../../helpers/validate';
import * as Joi from 'joi';
import * as _ from 'lodash';
import { escapeStringRegexp } from 'escape-string-regexp';

export default {
    Mutation: {
        addPublisher: async (root, { name, phone_number, address }) => {
            let publisher = new Publisher({
                name: name,
                name_slug: changeAlias(name),
                phone_number: phone_number,
                address: address
            });
            return await publisher.save();
        },
        updatePublisher: async (root, { id, name, phone_number, address, is_active }) => {
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

            let publisher_update = await Publisher.findOneAndUpdate({ _id: id }, { $set: update }, { new: true });

            if (!publisher_update)
                throw new Error('Can not updated Store');

            return publisher_update;
        },

        removePublisher: async (root, { id }) => {
            let publisher_removed = await Publisher.findOneAndUpdate({
                _id: id,
                is_active: true
            }, { $set: { is_active: false } }, { new: true });

            if (!publisher_removed)
                throw new Error('Can not remove Publisher');

            return {
                message: 'Remove Publisher successful'
            };
        }
    },
    Query: {
        publisher: async (root, { id }) => {
            return await Publisher.findOne({ _id: id });
        },
        publishers: async (root, args) => {
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

            let list = Publisher
                .find(filter)
                .skip(args.offset)
                .limit(args.limit);

            return {
                list_publisher: await list,
                args
            };
        }
    },
    ListPublisher: {
        total_publisher: async ({ args }) => {
            let filter: any = {};

            if (args.search) {
                filter.$or = [
                    { name_slug: new RegExp(escapeStringRegexp(changeAlias(args.search)), 'gi') },
                ];
            }

            if (_.isBoolean(args.is_active)) {
                filter.is_active = args.is_active;
            }

            return await Publisher.find(filter).countDocuments();
        }
    }
};