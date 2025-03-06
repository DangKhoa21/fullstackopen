const express = require('express');
const router = express.Router();

const configs = require('../util/config')

const { getAsync } = require('../redis')

let visits = 0

/* GET index data. */
router.get('/', async (req, res) => {
  visits++

  res.send({
    ...configs,
    visits
  });
});

router.get('/statistics', async (_, res) => {
  const count = await getAsync('count')
  res.send({
    added_todos: count ? Number(count) : 0
  });
});

module.exports = router;
