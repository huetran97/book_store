import { Language } from '@private/models';
import Validate from '../../../helpers/validate';
import * as Joi from 'joi';
import * as _ from 'lodash';

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
                throw new Error('Can not updated Language');

            return language_updated;
        },

        removeLanguage: async (root, { id }) => {
            let language_removed = await Language.findOneAndUpdate({
                _id: id,
                is_active: true
            }, { $set: { is_active: false } }, { new: true });

            if (!language_removed)
                throw new Error('Can not remove Language');

            return {
                message: 'Remove Language successful'
            };
        }
    },
    Query: {

        languages: async (root, args) => {
            args = new Validate(args)
                .joi({
                    offset: Joi.number().integer().optional().min(0).default(0),
                    limit: Joi.number().integer().optional().min(5).default(20)
                }).validate();

            let filter: any = {};


            if (_.isBoolean(args.is_active)) {
                filter.is_active = args.is_active;
            }

            let list = Language
                .find(filter)
                .skip(args.offset)
                .limit(args.limit);

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