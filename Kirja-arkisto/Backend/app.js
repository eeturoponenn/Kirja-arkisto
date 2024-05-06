const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const seriesRoutes = require('./routes/series-routes');
const booksRoutes = require('./routes/books-routes');
const libraryRoutes = require('./routes/library-routes');
const HttpError = require('./models/http-error');
const cors = require("cors");

const app = express();

app.use(bodyParser.json());

//Sallitaan CORS-pyynnöt
app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods','GET, POST, PUT, PATCH, DELETE');
    next();
});

var corsOptions = {
  origin: "http://localhost:3000"
};

app.use(cors(corsOptions));

// pyynnöt json
app.use(express.json());

// parsee pyynnöt url
app.use(express.urlencoded({ extended: true }));

const db = require("./models");
const Role = db.role;

app.use('/api/series',seriesRoutes)

app.use('/api/books',booksRoutes)

app.use('/api/library',libraryRoutes)

require("./routes/auth.routes")(app);
require("./routes/user.routes")(app);


app.use((req, res, next) =>{
    const error = new HttpError('Could not find route',404);
    throw error;
});

app.use((error, req, res, next) => {
    if(res.headerSent){
        return next(error);
    }
    res.status(error.code || 500)
    res.json({message: error.message || 'Unknown error'})
});
mongoose
    .connect('mongodb+srv://roponenn:RyhmaK123@cluster0.6ndcaoc.mongodb.net/bookarchiveDB?retryWrites=true&w=majority', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(() =>{
        app.listen(5000);
        console.log("Successfully connect to MongoDB.");
        initial();
    })
    .catch(err =>{
        console.log(err)
    });

    function initial() {
      Role.estimatedDocumentCount((err, count) => {
        if (!err && count === 0) {
          new Role({
            name: "user"
          }).save(err => {
            if (err) {
              console.log("error", err);
            }
    
            console.log("added 'user' to roles collection");
          });
    
          //Jos haluaa lisää rooleja
          /*
          new Role({
            name: "moderator"
          }).save(err => {
            if (err) {
              console.log("error", err);
            }
    
            console.log("added 'moderator' to roles collection");
          });
    
          new Role({
            name: "admin"
          }).save(err => {
            if (err) {
              console.log("error", err);
            }
    
            console.log("added 'admin' to roles collection");
          });
    
          */
    
        }
      });
    }
