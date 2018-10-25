import jobs from './queue';
import * as kue from 'kue';
import * as constantsJob from './constants';
import * as mongoose from 'mongoose';
import { MONGODB_URI } from '../configs';

/* Connect mongodb */
mongoose.connect(MONGODB_URI);

// Job process