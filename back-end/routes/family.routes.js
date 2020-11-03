module.exports = app => {
    const family = require('../controllers/family.controller');
    let router = require('express').Router();

    router.post('/', family.create);
    
    router.get('/:id', family.findOne);

    router.get('/positions/:id', family.findAllPositionOfOneFamily);

    router.get('/', family.findAll);

    router.put('/:id', family.update);

    router.delete('/:id', family.delete);

    app.use('/api/family', router);

};