import * as mongoose from 'mongoose';
import { MONGODB_URI } from '../configs';

mongoose.connect(MONGODB_URI);

export default (handle) => {
    handle().then(res => {
        console.log(res);
    }).catch(error => {
        console.log(error);
    });
};