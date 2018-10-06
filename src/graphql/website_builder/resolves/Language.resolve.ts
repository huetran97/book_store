import { Language } from '@private/models';
import Validate from '../../../helpers/validate';
import * as Joi from 'joi';
import * as _ from 'lodash';
import Exception from '../../../exeptions/Exception';
import ExceptionCode from '../../../exeptions/ExceptionCode';

export default {

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