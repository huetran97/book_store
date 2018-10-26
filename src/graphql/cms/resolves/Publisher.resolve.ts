import { Publisher } from '@private/models';
import { changeAlias } from '../../../helpers';
import Validate from '../../../helpers/validate';
import * as Joi from 'joi';
import * as _ from 'lodash';
import * as  escapeStringRegexp from 'escape-string-regexp';
import Exception from '../../../exeptions/Exception';
import ExceptionCode from '../../../exeptions/ExceptionCode';

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
                throw new Exception('Can not updated Publisher', ExceptionCode.CAN_NOT_UPDATE_PUBLISHER);

            return publisher_update;
        },

        removePublisher: async (root, { id }) => {
            let publisher_removed = await Publisher.findOneAndUpdate({
                _id: id,
                $or:[
                    { is_active: true },
                    {is_active: null}
                ]            }, { $set: { is_active: false } }, { new: true });

            if (!publisher_removed)
                throw new Exception('Can not remove Publisher', ExceptionCode.CAN_NOT_REMOVE_PUBLISHER);

            return {
                message: 'Remove Publisher successful'
            };
        }
    },
    Query: {
        publisher: async (root, { id }) => {
            let pushlisher = await Publisher.findOne({ _id: id });
            if (!pushlisher)
                throw new Exception('Publisher not found', ExceptionCode.PUBLISHER_NOT_FOUND);
            return pushlisher;
        },
        publishers: async (root, args) => {
            args = new Validate(args)
                .joi({
                    offset: Joi.number().integer().optional().min(0),
                    limit: Joi.number().integer().optional().min(5)
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

            let list = Publisher.find(filter);


            if (args.offset)
                list.skip(args.offset);
            if (args.limit)
                list.skip(args.limit);

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
                    { name_slug: new RegExp(escapeStringRegexp(changeAlias(args.search)), 'gi') }
                ];
            }

            if (_.isBoolean(args.is_active)) {
                filter.is_active = args.is_active;
            }

            return await Publisher.find(filter).countDocuments();
        }
    }
};