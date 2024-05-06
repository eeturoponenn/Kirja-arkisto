const { default: mongoose } = require('mongoose')
const HttpError = require('../models/http-error')
const Library = require('../models/library')
const User = require('../models/users')


const createLibrarySeries = async(req, res, next) =>{
    const {name, books} = req.body
    const newid = new mongoose.Types.ObjectId().toHexString();
    const createdLibrarySeries = new Library({
        name,
        books,
        _id: newid
    });
    try{
        await createdLibrarySeries.save();
    }catch(err){
        const error = new HttpError(
            'Creating series failed, please try again',
            500
        );
        return next(error);

    }
    res.status(201).json(createdLibrarySeries)
}

const updateLibrarySeriesByUserId = async(req, res, next) => {
    const {name, description, books, seriesId, bookData} = req.body;
    const userId = req.params._id;
    const newid = new mongoose.Types.ObjectId().toHexString();
    let user;
    try {
        user = await User.findById(userId).populate({
        path: 'series',
        populate: { path: 'books' }
    });
    }  catch(err){
        const error = new HttpError(
            'Updating order failed',
            500
        );
        return next(error);
    }
    if(user){
        
      
        if (name || description) {
            
            const newSeries = {name, description, books} // Create a new series object
            user.series.push(newSeries) // Add the new series object to the user's series array
        }
        if (bookData) {
           

            console.log("user series",user.series)
            const series = user.series.find((series) => series._id.toString() === seriesId);
            if(!series) {
                const error = new HttpError(
                    'Could not find that series',
                    404
                );
                return next(error);
            }
            series.books.push(bookData);
        }
        try{
            await user.save();
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
            'Could not find that user',
            404
        );
        return next(error);
    }

    res.json({user: user.toObject({getters: true})});
};


const updateSerieById = async(req, res, next) => {
    const {name, description, id } = req.body;
    const userId = req.params._id;
    console.log(id)
    let user;
    try {
        user = await User.findById(userId).populate({
        path: 'series',
        populate: { path: 'books' }
    });
    }  catch(err){
        const error = new HttpError(
            'Updating order failed',
            500
        );
        return next(error);
    }
    if(user){
        const serie = user.series.find((serie) => serie.id === id);
        

        serie.name = name;
        serie.description = description;
 
        try{
            await user.save();
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
            'Could not find that user',
            404
        );
        return next(error);
    }

    res.json({user: user.toObject({getters: true})});
};


const deleteLibrarySeriesById = async(req, res, next) =>{
    const userId = req.params._id;
    const {serieId, bookId} = req.body;
    
    let user;
    try{
        user = await User.findById(userId).populate({
        path: 'series',
        populate: { path: 'books' }
        })
    } catch(err){
        const error = new HttpError(
            'Deleting order failed',
            500
        );
        return next(error);
    }
    if(user){
        try{
        
          

            const serieIdObj = mongoose.Types.ObjectId(serieId);

            const serie = user.series.find((serie) => serie._id.toString() === serieIdObj.toString());


            
            if(bookId){
              
                const book = serie.books.findIndex((book) => book._id.toString() === bookId);
                

                if (book !== -1) {
                    serie.books.splice(book, 1);
                    await user.save();
                }
            
            }
           else if(serie){
            
            user.series.pull(serie);
            await user.save();
           }
          
          

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
            'Could not find that series',
            404
        );
        return next(error);
    }

    res.status(200).json({message: 'Deleted order'})
}


    getLibraryByUserId = async (req, res, next) =>{
    const userId = req.params._id;
    let user;
    try {
        user = await User.findById(userId).populate({
        path: 'series',
        populate: { path: 'books' }
    });
    } catch (err) {
        console.log("user",user)

      console.log(err)
      const error = new HttpError(
        'Something went wrong, cannot find user data',
        500
      );
      return next(error);
    }
  if(!user){
    const error = new HttpError(
      'Could not find a user by given id',
      500
    );
    return next(error);
  }
  res.json({user: user.toObject()})
  }


exports.createLibrarySeries = createLibrarySeries;
exports.updateLibrarySeriesByUserId = updateLibrarySeriesByUserId;
exports.deleteLibrarySeriesById = deleteLibrarySeriesById;
exports.getLibraryByUserId = getLibraryByUserId;
exports.updateSerieById = updateSerieById;
