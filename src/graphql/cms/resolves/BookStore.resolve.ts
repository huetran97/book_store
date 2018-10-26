import { Book, BookStore, Store } from '@private/models';
import Exception from '../../../exeptions/Exception';
import ExceptionCode from '../../../exeptions/ExceptionCode';
import * as _ from 'lodash';
import { ObjectID } from 'bson';

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

            let bookData  = await Book.findOne({_id: book});
            if(!bookData)
                throw new Exception('Book not found', ExceptionCode.BOOK_NOT_FOUND);

            if(amount > bookData.amount)
                throw new Exception('Amount Book at Store must be less than Amount Book', ExceptionCode.MUST_LESS_THAN_AMOUNT);
            
            let amountData: any = await BookStore.aggregate(
                [
                    {
                        $match: {
                            book: new ObjectID(book),
                        }
                    },
                    {
                        $group:
                            {
                                _id: {book:'$book'},
                                amount: { $sum: '$amount' },

                            }
                    },
                    {
                        $lookup: {
                            from: 'book',
                            localField: '_id.book',
                            foreignField: '_id',
                            as: 'bookDetail'
                        }
                    }

                ]
            );
            console.log('amountData', JSON.stringify(amountData));
            if (amountData.length > 0) {

                let exist = amountData[0].bookDetail[0].amount - amountData[0].amount;


                if (amount > exist) {
                    throw new Exception(`In stock only ${exist} books`, ExceptionCode.IN_STOCK_ONLY_NUMBER_BOOKS);
                }
            }


            let newBookStore = new BookStore({
                book: book,
                store: store,
                amount: amount
            });

            await Book.findOneAndUpdate({ _id: book }, { $set: { is_active: true } }, { new: true });

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
                await Book.findOneAndUpdate({ _id: book }, { $set: { is_active: true } }, { new: true });

            }

            if (book && !store) {
                let bookStoreData = await BookStore.findOne({
                    book: book, store: bookStoreUpdated.store
                });
                if (bookStoreData)
                    throw new Exception('Book is exist in Store', ExceptionCode.BOOK_IS_EXIST_IN_THIS_STORE);
                bookStoreUpdated.book = book;
                await Book.findOneAndUpdate({ _id: book }, { $set: { is_active: true } }, { new: true });

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