import express from 'express';
import data from '../src/testData';

const router = express.Router();

router.get('/messages', (req, res) => {
  res.send({ contests: data.messages });
});

export default router;