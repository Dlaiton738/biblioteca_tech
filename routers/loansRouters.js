import { Router } from 'express';
import { getLoans} from '../controllers/loansController.js';
import { getLoanById } from '../controllers/loansController.js';
import { createLoan } from '../controllers/loansController.js';
import { returnLoan } from '../controllers/loansController.js';


const router = Router();

router.get('/', getLoans);
router.post('/', createLoan);
router.get('/:_id', getLoanById);
router.patch('/:_id/return', returnLoan);

export default router;
