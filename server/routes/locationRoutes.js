import express from 'express';
import { getStates, getDistricts, getBlocks, getAllLocations } from '../controllers/locationController.js';

const router = express.Router();

router.get('/states', getStates);
router.get('/states/:state/districts', getDistricts);
router.get('/states/:state/districts/:district/blocks', getBlocks);
router.get('/all', getAllLocations);

export default router;
