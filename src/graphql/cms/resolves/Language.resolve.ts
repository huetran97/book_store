import { Language } from '@private/models';
import Validate from '../../../helpers/validate';
import * as Joi from 'joi';
import * as _ from 'lodash';
import Exception from '../../../exeptions/Exception';
import ExceptionCode from '../../../exeptions/ExceptionCode';

export default {
    Mutation: {
        addLanguage: async (root, { name }) => {
            let language = new Language({
                name: name
            });
            return await language.save();
        },
        updateLanguage: async (root, { id, name, is_active }) => {
            let update: any = {};

            if (name) {
                update.name = name;
            }

            if (_.isBoolean(is_active))
                update.is_active = is_active;

            let language_updated = await Language.findOneAndUpdate({ _id: id }, { $set: update }, { new: true });

            if (!language_updated)
                throw new Exception('Can not updated Language', ExceptionCode.CAN_NOT_UPDATE_LANGUAGE);

            return language_updated;
        },

        removeLanguage: async (root, { id }) => {
            let language_removed = await Language.findOneAndUpdate({
                _id: id,
                is_active: true
            }, { $set: { is_active: false } }, { new: true });

            if (!language_removed)
                throw new Exception('Can not remove Language', ExceptionCode.CAN_NOT_REMOVE_LANGUAGE);

            return {
                message: 'Remove Language successful'
            };
        }
    },
    Query: {
        language: async (root, { id }) => {
            let language_data = await Language.findOne({ _id: id });
            if (!language_data)
                throw new Exception('Language not found', ExceptionCode.LANGUAGE_NOT_FOUND);

            return language_data;
        },

        languages: async (root, args) => {
            args = new Validate(args)
                .joi({
                    offset: Joi.number().integer().optional().min(0),
                    limit: Joi.number().integer().optional().min(5)
                }).validate();

            let filter: any = {};


            if (_.isBoolean(args.is_active)) {
                filter.$or = [
                    { is_active: args.is_active },
                    { is_active: null }
                ];
            }

            let list = Language.find(filter);

            if (args.offset)
                list.skip(args.offset);
            if (args.limit)
                list.skip(args.limit);

            return {
                list_language: await list,
                args
            };
        }
    },
    ListLanguage: {
        total_language: async ({ args }) => {
            let filter: any = {};

            if (_.isBoolean(args.is_active)) {
                filter.is_active = args.is_active;
            }

            return await Language.find(filter).countDocuments();
        }
    }
};