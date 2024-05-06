const express = require('express');
const seriesController = require('../controllers/series-controller')

const router = express.Router();



router.get('/', seriesController.getAllSeries)

router.get('/:_id', seriesController.getSeriesById);

router.post('/', seriesController.createSeries);

router.put('/:_id', seriesController.updateSeriesById);

router.delete('/:_id', seriesController.deleteSeriesById);


module.exports = router;