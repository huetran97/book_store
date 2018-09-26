import * as mongoose from 'mongoose';
import * as moment from 'moment-timezone';
import { TIMEZONE } from '../src/configs';
import MongodbMemoryServer from 'mongodb-memory-server';

declare var process: NodeJS.Process;

const mongod = new MongodbMemoryServer();

moment.tz.setDefault(TIMEZONE);

before(async () => {
    // Setup before test
    await mongoose.connect(await mongod.getConnectionString());
});

after(async () => {
    await mongoose.disconnect();
    await mongod.stop();

    /* Exit test */
    process.exit(0);
});
