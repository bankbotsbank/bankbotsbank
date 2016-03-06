import BbvaBot from '../bots/bbva';
import express from 'express';

const router = express.Router();

router.post('/transactions', async function (req, res) {
  if (!req.body.username || !req.body.password) {
    res.status(400).json({ errors: [{ code: 'missing_credentials' }] });
    return;
  }

  const { error, data } =
    await BbvaBot.fetch({ username: req.body.username, password: req.body.password });

  if (error) {
    res.status(500).json({ errors: [error] });
  } else {
    res.status(200).json(data);
  }
});

export default router;
