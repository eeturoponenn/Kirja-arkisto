const express = require('express');
const libraryController = require('../controllers/library-controller')


const router = express.Router();


router.get('/:_id', libraryController.getLibraryByUserId);

router.post('/', libraryController.createLibrarySeries);

router.patch('/:_id', libraryController.updateLibrarySeriesByUserId);

router.put('/:_id', libraryController.updateSerieById);

router.delete('/:_id', libraryController.deleteLibrarySeriesById);

module.exports = router;