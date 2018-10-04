import { Author, Book, DomainKnowledge, IssuingCompany, Language, Publisher, Store, Subject } from '@private/models';
import * as _ from 'lodash';
import Validate from '../../../helpers/validate';
import * as Joi from 'joi';
import * as  escapeStringRegexp from 'escape-string-regexp';
import { changeAlias } from '../../../helpers';

export default {

    Query: {
        book: async (root, { id }) => {
            let book_data = await Book.findOne({ _id: id });
            if (!book_data)
                throw new Error('Book not found');

            return book_data;
        },
        books: async (root, args) => {
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

            let list = Book
                .find(filter)
                .skip(args.offset)
                .limit(args.limit)
                .sort({ is_active: -1 })
            ;

            return {
                list_book: await list,
                total_book: await list.count(),
                args
            };
        }
    },
    Book: {
        language: async (book) => {
            return await Language.findOne({ _id: book.language });
        },
        domain_knowledge: async (book) => {
            return await DomainKnowledge.findOne({ _id: book.domain_knowledge });
        },
        subjects: async (book) => {
            let total = book.subject.length;
            return {
                total_subject: total,
                list_subject: await Subject.find({ _id: { $in: book.subject } })
            };
        },
        author: async (book) => {
            return await Author.findOne({ _id: book.auth });
        },
        publisher: async (book) => {
            return await Publisher.findOne({ _id: book.publisher });
        },
        issuing_company: async (book) => {
            return await IssuingCompany.findOne({ _id: book.issuing_company });
        },
        store: async (book) => {
            return await Store.findOne({ _id: book.store });
        }
    }
};