const { default: mongoose } = require('mongoose')
const HttpError = require('../models/http-error')
const Series = require('../models/series')


const createSeries = async(req, res, next) =>{
    const {name, description} = req.body
    const newid = new mongoose.Types.ObjectId().toHexString();
    const createdSeries = new Series({
        name,
        description,
        _id: newid
    });
    try{
        await createdSeries.save();
    }catch(err){
        const error = new HttpError(
            'Creating series failed, please try again',
            500
        );
        return next(error);

    }
    res.status(201).json(createdSeries)
}

const updateSeriesById = async(req, res, next) => {
    const {name, description, lastAddedBookId} = req.body;
    const seriesId = req.params._id;
    let series;
    console.log('series', seriesId, name, description, lastAddedBookId, req.body);
    try{
        series = await Series.findById(seriesId)
    } catch(err){
        const error = new HttpError(
            'Updating order failed',
            500
        );
        return next(error);
    }
    if(series){
        series.name = name;
        series.description = description;
        if (lastAddedBookId) {
            series.books.push(lastAddedBookId);
        }
        try{
            await series.save();
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

    res.json({series: series.toObject({getters: true})});
};

const deleteSeriesById = async(req, res, next) =>{
    const seriesId = req.params._id;
    let series;
    try{
        series = await Series.findById(seriesId)
    } catch(err){
        const error = new HttpError(
            'Deleting order failed',
            500
        );
        return next(error);
    }
    if(series){
        try{
            series.remove();
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

const getAllSeries = async (req, res, next) =>{
    let series;
    try{
        series = await Series.find().populate('books');
    } catch(err){
        const error = new HttpError(
            'Something went wrong here, cannot fetch series',
            500
        );
        return next(error)
    }
    if(!series || series.length === 0){
        const error = new HttpError(
            'Could not find series',
            404
        );
        return next(error);
    }
    res.json(series)
}

const getSeriesById = async (req, res, next) =>{
    const seriesId = req.params._id;
    let series;
    try {
        series = await Series.findById(seriesId).populate('books');
    } catch (err) {
        const error = new HttpError(
            'Something went wrong here, cannot find a series',
            500
        );
        return next(error);
    }
    if(!series){
        const error = new HttpError(
            'Could not find a series by given id',
            404
        );
        return next(error)
    }

    res.json({series: series.toObject()});
}
exports.getAllSeries = getAllSeries;
exports.getSeriesById = getSeriesById;
exports.createSeries = createSeries;
exports.updateSeriesById = updateSeriesById;
exports.deleteSeriesById = deleteSeriesById;
