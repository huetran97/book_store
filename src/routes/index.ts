import * as express from 'express';
import * as controllers from '../controllers';

const router = express.Router();

// Route

router.get('/', controllers.hello.helloWorld);

export default router;