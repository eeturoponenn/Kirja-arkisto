const express = require('express');
const booksController = require('../controllers/books-controller')


const router = express.Router();

router.get('/', booksController.getAllBooks);

router.get('/:_id', booksController.getBookById);

router.post('/', booksController.createBook);

router.put('/:_id', booksController.updateBookById);

router.delete('/:_id', booksController.deleteBookById);

module.exports = router;