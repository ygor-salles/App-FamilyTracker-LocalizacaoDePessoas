module.exports = app => {
    const position = require('../controllers/position.controller');
    let router = require('express').Router();

    router.post('/', position.create);
    
    router.get('/:id', position.findOne);

    router.get('/', position.findAll);

    router.put('/:id', position.update);

    router.delete('/:id', position.delete);

    app.use('/api/position', router);

};