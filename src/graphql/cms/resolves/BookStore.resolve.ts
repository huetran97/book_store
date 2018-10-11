import { Book, BookStore, Store } from '@private/models';
import Exception from '../../../exeptions/Exception';
import ExceptionCode from '../../../exeptions/ExceptionCode';
import * as _ from 'lodash';

export default {
    Query: {
        // bookStore: async (root, { book_id, store_id }) => {
        //     if (!book_id && store_id)
        //         throw new Exception('Missing book_id or store_id', ExceptionCode.MISSING_BOOKID_OR_STOREID);
        //     if (book_id) {
        //         let bookStoreData = await BookStore.aggregate(
        //             [
        //                 {
        //                     $group:
        //                         {
        //                             _id: { book: book_id },
        //                             mount: { $sum: '$amount' },
        //                             book: '$book',
        //                         }
        //                 }
        //             ]
        //         );
        //         console.log('bookStoreData', bookStoreData);
        //         return bookStoreData[0].mount;
        //     }
        // }
    },
    Mutation: {
        addBookStore: async (root, { book, store, amount }) => {
            let bookStoreData = await BookStore.findOne({
                book: book, store: store
            });

            if (bookStoreData)
                throw new Exception('Book is exist in Store', ExceptionCode.BOOK_IS_EXIST_IN_THIS_STORE);

            let newBookStore = new BookStore({
                book: book,
                store: store,
                amount: amount
            });
            return await newBookStore.save();
        },

        updateBookStore: async (root, { id, book, store, amount, is_active }) => {
            let bookStoreUpdated = await BookStore.findOne({ _id: id });
            if (!bookStoreUpdated)
                throw new Exception('Book Stored not found', ExceptionCode.BOOK_STORE_NOT_FOUND);


            if (book && store) {
                let bookStoreData = await BookStore.findOne({
                    book: book, store: store
                });
                if (bookStoreData)
                    throw new Exception('Book is exist in Store', ExceptionCode.BOOK_IS_EXIST_IN_THIS_STORE);

                bookStoreUpdated.book  = book;
                bookStoreUpdated.store = store;
            }

            if (book && !store) {
                let bookStoreData = await BookStore.findOne({
                    book: book, store: bookStoreUpdated.store
                });
                if (bookStoreData)
                    throw new Exception('Book is exist in Store', ExceptionCode.BOOK_IS_EXIST_IN_THIS_STORE);
                bookStoreUpdated.book = book;

            }
            if (!book && store) {
                let bookStoreData = await BookStore.findOne({
                    book: bookStoreUpdated.book, store: store
                });
                if (bookStoreData)
                    throw new Exception('Book is exist in Store', ExceptionCode.BOOK_IS_EXIST_IN_THIS_STORE);
                bookStoreUpdated.store = store;

            }

            if (amount >= 0) {
                bookStoreUpdated.amount = amount;

            }

            if (_.isBoolean(is_active))
                bookStoreUpdated.is_active = is_active;

            return await bookStoreUpdated.save();

        }
    },
    BookStore: {
        book: async (bookStore) => {
            return await Book.findOne({ _id: bookStore.book });
        },
        store: async (bookStore) => {
            return await Store.findOne({ _id: bookStore.store });
        }
    }
};