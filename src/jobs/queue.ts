import * as kue from 'kue';
import { REDIS } from '../configs';

const queue = kue.createQueue({
    prefix: 'queue',
    jobEvents: false,
    redis: {
        host: REDIS.HOST,
        port: REDIS.PORT
    }
});

export function createJob (event, data, delay: any = 0) {
    queue.create(event, data).removeOnComplete(true).delay(delay).save();
}

queue.setMaxListeners(1000);

export default queue;