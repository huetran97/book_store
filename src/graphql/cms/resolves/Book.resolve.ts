import {
    Author,
    Book,
    BookStore,
    DomainKnowledge,
    IssuingCompany,
    Language,
    Publisher,
    Subject
} from '@private/models';
import * as _ from 'lodash';
import Validate from '../../../helpers/validate';
import * as Joi from 'joi';
import * as  escapeStringRegexp from 'escape-string-regexp';
import { changeAlias } from '../../../helpers';
import Exception from '../../../exeptions/Exception';
import ExceptionCode from '../../../exeptions/ExceptionCode';
import { ObjectID } from 'bson';

export default {
    Mutation: {
        addBook: async (root, {
            name, description, author, price, publisher, publication_date, language,
            domain_knowledge, subjects, size, issuing_company, print_length, cover_type, thumbnail,
            book_code,
            amount,
        }) => {

            let language_data         = await Language.findOne({ _id: language });
            let domain_knowledge_data = await DomainKnowledge.findOne({ _id: domain_knowledge });

            let author_data          = await Author.findOne({ _id: author });
            let publisher_data       = await Publisher.findOne({ _id: publisher });
            let issuing_company_data = await IssuingCompany.findOne({ _id: issuing_company });

            if (!language_data || !domain_knowledge_data || !author_data || !publisher_data || !issuing_company_data) throw new Error('Invalid data');

            for (let subject_id of subjects) {
                let subject_data = await Subject.findOne({ _id: subject_id });
                if (!subject_data)
                    throw new Error('Invalid data');

                if (domain_knowledge_data.language.toString() !== language_data._id.toString() ||
                    subject_data.domain_knowledge.toString() !== domain_knowledge_data._id.toString()
                ) throw new Error('Invalid data1');

            }
            console.log('author', author);

            let book_data = new Book({
                name: name,
                book_code: book_code,
                description: description,
                author: author,
                price: price,
                publisher: publisher,
                publication_date: publication_date,
                language: language,
                domain_knowledge: domain_knowledge,
                subject: subjects,
                size: size,
                amount: amount,
                issuing_company: issuing_company,
                print_length: print_length,
                cover_type: cover_type,
                thumbnail: thumbnail
            });
            return await book_data.save();
        },
        updateBook: async (root, {
            id, name, description, author, price, publisher, publication_date,
            language, domain_knowledge, subjects, size, issuing_company,
            thumbnail,amount,
            print_length, cover_type, book_code, is_active
        }) => {
            let update: any = {};

            // let language_data         = await Language.findOne({ _id: language });
            // let domain_knowledge_data = await DomainKnowledge.findOne({ _id: domain_knowledge });
            //
            // let author_data          = await Author.findOne({ _id: author });
            // let publisher_data       = await Publisher.findOne({ _id: publisher });
            // let issuing_company_data = await IssuingCompany.findOne({ _id: issuing_company });
            //
            // if (!language_data || !domain_knowledge_data || !author_data || !publisher_data || !issuing_company_data) throw new Error('Invalid data');
            //
            // for (let subject_id of subjects) {
            //     let subject_data = await Subject.findOne({ _id: subject_id });
            //     if (!subject_data)
            //         throw new Error('Invalid data');
            //
            //     if (domain_knowledge_data.language.toString() !== language_data._id.toString() ||
            //         subject_data.domain_knowledge.toString() !== domain_knowledge_data._id.toString()
            //     ) throw new Error('Invalid data1');
            //
            // }
            if (name)
                update.name = name;

            if (amount)
                update.amount = amount;

            if (book_code) {
                let bookData = await Book.findOne({ book_code: book_code });
                if (bookData)
                    throw new Exception('Book is exist', ExceptionCode.BOOK_IS_EXIST);
                update.book_code = book_code;

            }

            if (description)
                update.description = description;

            if (thumbnail)
                update.thumbnail = thumbnail;

            if (author) {
                let author_data = await Author.findOne({ _id: author });
                if (!author_data)
                    throw new Error('Author not found');
                update.author = author;
            }


            if (price)
                update.price = price;
            if (publisher) {
                let publisher_data = await Publisher.findOne({ _id: publisher });
                if (!publisher_data)
                    throw new Error('Publisher not found');

                update.publisher = publisher;
            }

            if (publication_date)
                update.publication_date = publication_date;

            if (language)
                update.language = language;

            if (domain_knowledge)
                update.domain_knowledge = domain_knowledge;

            if (subjects.length > 0)
                update.subject = subjects;

            if (size)
                update.size = size;

            if (issuing_company) {
                let issuing_company_data = await IssuingCompany.findOne({ _id: issuing_company });
                if (!issuing_company_data)
                    throw new Error('Issuing company not found');
                update.issuing_company = issuing_company;
            }
            if (print_length)
                update.print_length = print_length;
            if (cover_type)
                update.cover_type = cover_type;

            if (_.isBoolean(is_active))
                update.is_active = is_active;

            let book_updated = await Book.findOneAndUpdate({ _id: id }, { $set: update }, { new: true });

            if (!book_updated)
                throw new Error('Cannot update this book');

            return book_updated;
        },
        removeBook: async (root, { id }) => {
            let book_removed = await Book.findOneAndRemove({ _id: id, is_active: true });

            if (!book_removed)
                throw new Error('Can not remove book');

            return {
                message: 'Remove book successful'
            };
        }
    },
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
            if (args.store) {
                let bookInStoreID = await BookStore.find({ store: args.store }).distinct('book');
                filter._id        = { $in: bookInStoreID };
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
            return await Author.findOne({ _id:new ObjectID(book.author) });
        },
        publisher: async (book) => {
            return await Publisher.findOne({ _id: book.publisher });
        },
        issuing_company: async (book) => {
            return await IssuingCompany.findOne({ _id: book.issuing_company });
        }
    }
};