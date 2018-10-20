import { Author } from '@private/models';
import { changeAlias } from '../../../helpers';
import Validate from '../../../helpers/validate';
import * as Joi from 'joi';
import * as _ from 'lodash';
import * as  escapeStringRegexp from 'escape-string-regexp';
import Exception from '../../../exeptions/Exception';
import ExceptionCode from '../../../exeptions/ExceptionCode';

export default {

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
                    offset: Joi.number().integer().optional().min(0).default(0),
                    limit: Joi.number().integer().optional().min(5).default(20)
                }).validate();

            let filter: any = {is_active:true};


            if (args.search) {
                filter.$or = [
                    { name_slug: new RegExp(escapeStringRegexp(changeAlias(args.search)), 'gi') }
                ];
            }


            let list = Author
                .find(filter)
                .skip(args.offset)
                .limit(args.limit);

            return {
                list_author: await list,
                args
            };
        }
    },
    ListAuthor: {
        total_author: async ({ args }) => {
            let filter: any = {is_active:true};

            if (args.search) {
                filter.$or = [
                    { name_slug: new RegExp(escapeStringRegexp(changeAlias(args.search)), 'gi') }
                ];
            }

            return await Author.find(filter).countDocuments();
        }
    }
};