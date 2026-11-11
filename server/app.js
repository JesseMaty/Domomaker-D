require('dotenv').config();

const path = require('path');
const express = require('express');
const compression = require('compression');
const favicon = require('serve-favicon');
const mongoose = require('mongoose');
const expressHandlebars = require('express-handlebars');
const helmet = require('helmet');
const session = require('express-session');
const RedisStore = require('connect-redis').RedisStore;
const redis = require('redis');

const router = require('./router.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const dbURI = process.env.MONGODB_URI || 'mongodb://localhost/DomoMaker';
mongoose.connect(dbURI).catch((err) => {
    if (err) {
        console.log('Could not connect to database');
        throw err;
    }
});


const redisClient = redis.createClient({
    url: process.env.REDISCLOUD_URL,
});

redisClient.on('error', err => console.log('Redis Client Error', err));

redisClient.connect().then(() => {
    const app = express();

    app.use(helmet());
    app.use('/assets', express.static(path.resolve(`${__dirname}/../hosted`)));
    app.use(favicon(`${__dirname}/../hosted/img/favicon.png`));
    app.use(compression());

    // This will add a session object to every request object
    // It can later be accessed with "req.session"
    // The sesion object can be used to track and store information unique to
    // that user between requests.
    app.use(session({
        key: 'sessionid', // Name of your cookie to be tracked in requests
        store: new RedisStore({
            client: redisClient,
        }),
        secret: 'Domo Arigato', // Private string used as a seed for hashing/creating unique session keys
        resave: false,  // Tells session lib to only send session key to db on changes
        saveUninitialized: false,   // Prevents us from saving uninitialized sessionids to db
    }));

    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    // This will add a session object to every request object
    // It can later be accessed with "req.session"
    // The sesion object can be used to track and store information unique to
    // that user between requests.
    app.use(session({
        key: 'sessionid', // Name of your cookie to be tracked in requests
        store: new RedisStore({
            client: redisClient,
        }),
        secret: 'Domo Arigato', // Private string used as a seed for hashing/creating unique session keys
        resave: false,  // Tells session lib to only send session key to db on changes
        saveUninitialized: false,   // Prevents us from saving uninitialized sessionids to db
    }));

    app.engine('handlebars', expressHandlebars.engine({ defaultLayout: '' }));
    app.set('view engine', 'handlebars');
    app.set('views', `${__dirname}/../views`);

    router(app);

    app.listen(port, (err) => {
        if (err) { throw err; }
        console.log(`Listening on port ${port}`);
    })

})
