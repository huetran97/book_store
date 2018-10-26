import { Author } from '@private/models';
import { changeAlias } from '../../../helpers';
import Validate from '../../../helpers/validate';
import * as Joi from 'joi';
import * as _ from 'lodash';
import * as  escapeStringRegexp from 'escape-string-regexp';
import Exception from '../../../exeptions/Exception';
import ExceptionCode from '../../../exeptions/ExceptionCode';

export default {
    Mutation: {
        addAuthor: async (root, { name, description }) => {
            let author = new Author({
                name: name,
                name_slug: changeAlias(name),
                description: description
            });
            return await author.save();
        },
        updateAuthor: async (root, { id, name, description, is_active }) => {
            let update: any = {};

            if (name) {
                update.name      = name;
                update.name_slug = changeAlias(name);
            }

            if (description)
                update.description = description;

            if (_.isBoolean(is_active))
                update.is_active = is_active;

            let authorUpdated = await Author.findOneAndUpdate({ _id: id }, { $set: update }, { new: true });

            if (!authorUpdated)
                throw new Exception('Can not updated Author', ExceptionCode.CAN_NOT_UPDATE_AUTHOR);

            return authorUpdated;
        },

        removeAuthor: async (root, { id }) => {
            let authorRemoved = await Author.findOneAndUpdate({
                _id: id,
                $or:[
                    { is_active: true },
                    {is_active: null}
                ]
            }, { $set: { is_active: false } }, { new: true });

            if (!authorRemoved)
                throw new Exception('Can not remove Author', ExceptionCode.CAN_NOT_REMOVE_AUTHOR);

            return {
                message: 'Remove author successful'
            };
        }
    },
    Query: {
        author: async (root, { id }) => {
            let author = await Author.findOne({ _id: id });
            if (!author)
                throw  new Exception('Author not found', ExceptionCode.AUTHOR_NOT_FOUND);
            return author;

        },
        authors: async (root, args) => {
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
                filter.$or = [
                    { is_active: args.is_active },
                    { is_active: null }
                ];
            }
            let list = Author.find(filter);

            if (args.offset)
                list.skip(args.offset);
            if (args.limit)
                list.skip(args.limit);

            return {
                list_author: await list,
                args
            };
        }
    },
    ListAuthor: {
        total_author: async ({ args }) => {
            let filter: any = {};

            if (args.search) {
                filter.$or = [
                    { name_slug: new RegExp(escapeStringRegexp(changeAlias(args.search)), 'gi') }
                ];
            }

            if (_.isBoolean(args.is_active)) {
                filter.is_active = args.is_active;
            }


            return await Author.find(filter).countDocuments();
        }
    }
};