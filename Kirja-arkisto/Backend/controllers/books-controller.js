const { default: mongoose } = require('mongoose')
const HttpError = require('../models/http-error')
const Books = require('../models/books')

const createBook = async(req, res, next) =>{
    const {name, author, condition, etukansikuva, takakansikuva, lisakuva1, hankintahinta, hankintaAika, kuvausteksti, piirtajat, ensipainosvuosi, painos} = req.body;
    const newid = new mongoose.Types.ObjectId().toHexString();
    const createdBook = new Books({
        name,
        author,
        condition,
        etukansikuva,
        takakansikuva,
        lisakuva1,
        hankintahinta,
        hankintaAika,
        kuvausteksti,
        piirtajat,
        ensipainosvuosi,
        painos,
        _id: newid
    });
    try{
        await createdBook.save();
    }catch(err){
        console.log(err);
        const error = new HttpError(
            'Creating book failed, please try again',
            500
        );
        return next(error);

    }
    res.status(201).json(createdBook)
}

const updateBookById = async(req, res, next) => {
    const {name, author, condition, serialNumber} = req.body;
    const bookId = req.params._id;
    let book;
    try{
        book = await Books.findById(bookId)
    } catch(err){
        const error = new HttpError(
            'Updating order failed',
            500
        );
        return next(error);
    }
    if(book){
            book.name = name;
            book.author = author;
            book.condition = condition;
            book.serialNumber = serialNumber;
        try{
            await book.save();
        } catch(err){
            const error = new HttpError(
                'Updating order failed',
                500
            );
            return next(error);
        }
    }
    else{
        const error = new HttpError(
            'Could not find that order',
            404
        );
        return next(error);
    }

    res.json({book: book.toObject({getters: true})});
};

const getAllBooks = async (req, res, next) =>{
    let books;
    try{
        books = await Books.find();
    } catch(err){
        const error = new HttpError(
            'Something went wrong here, cannot fetch books',
            500
        );
        return next(error)
    }
    if(!books || books.length === 0){
        const error = new HttpError(
            'Could not find books',
            404
        );
        return next(error);
    }
    res.json(books)
}

const deleteBookById = async(req, res, next) =>{
    const bookId = req.params._id;
    let book;
    try{
        book = await Books.findById(bookId)
    } catch(err){
        const error = new HttpError(
            'Deleting order failed',
            500
        );
        return next(error);
    }
    if(book){
        try{
            book.remove();
        } catch(err){
            const error = new HttpError(
                'Deleting order failed',
                500
            );
            return next(error)
        }
    }
    else{
        const error = new HttpError(
            'Could not find that book',
            404
        );
        return next(error);
    }

    res.status(200).json({message: 'Deleted order'})
}

const getBookById = async (req, res, next) =>{
    const bookId = req.params._id;
    let book;
    try {
        book = await Books.findById(bookId);
    } catch (err) {
        const error = new HttpError(
            'Something went wrong here, cannot find the book',
            500
        );
        return next(error);
    }
    if(!book){
        const error = new HttpError(
            'Could not find the book by given id',
            404
        );
        return next(error)
    }

    res.json({book: book.toObject()});
}

exports.deleteBookById = deleteBookById;
exports.getAllBooks = getAllBooks;
exports.getBookById = getBookById;
exports.createBook = createBook;
exports.updateBookById = updateBookById;



