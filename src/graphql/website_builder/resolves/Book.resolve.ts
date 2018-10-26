import { Author, Book, DomainKnowledge, IssuingCompany, Language, Publisher, Store, Subject } from '@private/models';
import * as _ from 'lodash';
import Validate from '../../../helpers/validate';
import * as Joi from 'joi';
import * as  escapeStringRegexp from 'escape-string-regexp';
import { changeAlias } from '../../../helpers';
import { BookStore } from '@private/models/index';
import Exception from '../../../exeptions/Exception';
import ExceptionCode from '../../../exeptions/ExceptionCode';
import { ObjectID } from 'bson';

export default {

    Query: {
        book: async (root, { book }) => {
            let bookStoreData = await BookStore.findOne({ book: book });
            if (!bookStoreData) throw new Exception('Book not found', ExceptionCode.BOOK_NOT_FOUND);

            let bookData = await Book.findOne({ _id: book });
            if (!bookData)
                throw new Exception('Book not found', ExceptionCode.BOOK_NOT_FOUND);

            return bookData;
        },
        books: async (root, args) => {
            args = new Validate(args)
                .joi({
                    offset: Joi.number().integer().optional().min(0).default(0),
                    limit: Joi.number().integer().optional().min(5).default(1000)
                }).validate();

            let filter: any = {
                is_active: true
            };

            if (args.search) {
                filter.$or = [
                    { name_slug: new RegExp(escapeStringRegexp(changeAlias(args.search)), 'gi') }
                ];
            }


            if (args.store) {
                let bookInStoreID = await BookStore.find({ store: args.store }).distinct('book');
                filter._id        = { $in: bookInStoreID };
            }

            if (args.language) {
                filter.language = args.language;
            }

            if (args.subject) {
                filter.subject = args.subject;
            }

            if (args.domain_knowledge) {
                filter.domain_knowledge = args.domain_knowledge;
            }

            let sort: any = {
                is_active: -1
            };
            if (_.isBoolean(args.is_hot_sale)) {
                sort.total_sold = -1;
            }

            if (_.isBoolean(args.is_newest)) {
                sort._id = 1;
            }

            let list = Book
                .find(filter)
                .skip(args.offset)
                .limit(args.limit)
                .sort(sort)
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
            console.log('bôk', book.author);
            return await Author.findOne({ _id: book.author });
        },
        publisher: async (book) => {
            return await Publisher.findOne({ _id: book.publisher });
        },
        issuing_company: async (book) => {
            return await IssuingCompany.findOne({ _id: book.issuing_company });
        },

        book_store: async (book) => {
            return await BookStore.find({ book: book._id });
        }
    },
    BookStore: {
        store: async (book) => {
            return await Store.findOne({ _id: new ObjectID(book.store) });
        }
    }
};