module.exports = app => {
    const profile = require('../controllers/profile.controller');
    let router = require('express').Router();

    router.post('/', profile.create);
    
    router.post('/login', profile.login);

    router.get('/:id', profile.findOne);

    router.get('/', profile.findAll);

    router.put('/:id', profile.update);

    router.delete('/:id', profile.delete);

    app.use('/api/profile', router);

};