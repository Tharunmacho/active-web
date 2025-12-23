import express from 'express';
import {
  getCompanies,
  getCompany,
  createCompany,
  updateCompany,
  deleteCompany,
  setActiveCompany,
  getActiveCompany
} from '../controllers/companyController.js';
import { protect } from '../../../shared/middleware/auth.js';

const router = express.Router();

router.get('/', protect, getCompanies);
router.get('/active', protect, getActiveCompany);
router.get('/:id', protect, getCompany);
router.post('/', protect, createCompany);
router.put('/:id', protect, updateCompany);
router.delete('/:id', protect, deleteCompany);
router.put('/:id/set-active', protect, setActiveCompany);

export default router;
