import { BookStore, Staff, Store } from '@private/models';
import { changeAlias } from '../../../helpers';
import Validate from '../../../helpers/validate';
import * as Joi from 'joi';
import * as _ from 'lodash';
import * as  escapeStringRegexp from 'escape-string-regexp';
import Exception from '../../../exeptions/Exception';
import ExceptionCode from '../../../exeptions/ExceptionCode';
import service from '@private/services';

export default {
    Mutation: {
        addStore: async (root, { name, phone_number, address }) => {
            let lat, long;
            let geocoding_data = await service.geocodingApi.getGeocodingData(address);
            if (geocoding_data.status === 'OK') {
                lat  = geocoding_data.results[0].geometry.location.lat;
                long = geocoding_data.results[0].geometry.location.lng;
            }
            let store = new Store({
                name: name,
                name_slug: changeAlias(name),
                phone_number: phone_number,
                address: address,
                latitude: lat,
                longitude: long
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

            if (address) {
                update.address = address;

                let geocoding_data = await service.geocodingApi.getGeocodingData(address);
                if (geocoding_data.status === 'OK') {
                    update.latitude  = geocoding_data.results[0].geometry.location.lat;
                    update.longitude = geocoding_data.results[0].geometry.location.lng;
                }
            }

            if (_.isBoolean(is_active))
                update.is_active = is_active;

            let store_updated = await Store.findOneAndUpdate({ _id: id }, { $set: update }, { new: true });

            if (!store_updated)
                throw new Exception('Can not updated Store', ExceptionCode.CAN_NOT_UPDATE_STORE);

            return store_updated;
        },

        removePublisher: async (root, { id }) => {
            let store_removed = await Store.findOneAndUpdate({
                _id: id,
                is_active: true
            }, { $set: { is_active: false } }, { new: true });

            if (!store_removed)
                throw new Exception('Can not remove Store', ExceptionCode.CAN_NOT_REMOVE_STORE);

            return {
                message: 'Remove Publisher successful'
            };
        }
    },
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
    },
    Store: {
        total_staff: async (store) => {
            return await Staff.find({ store: store._id, is_active: true }).countDocuments();
        },
        staffs: async (store) => {
            return await Staff.find({ store: store._id, is_active: true });
        },
        total_book: async (store) => {
            return await BookStore.find({ store: store._id, is_active: true }).countDocuments();
        },
        books: async (store) => {
            return await BookStore.find({ store: store._id, is_active: true });

        }
    }
};