const db = require('../models')
const Position = db.position;

exports.create = async (req, res) => {
    // Validate request
    if (!req.body.profile || !req.body.coordinates) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }

    // Create a Position instance
    const position = new Position({
        profile: req.body.profile,
        location: {
            type: 'Point',
            coordinates: req.body.coordinates
        }
    });

    // Checks if the position already exists for the user
    let profileHasPosition = await Position
        .findOne({ profile: req.body.profile })

    if (!profileHasPosition) {
        // Save Position in the database
        position
            .save()
            .then(data => {
                res.send(data);
            })
            .catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while creating the position."
                });
            });
    } else {
        res.status(500).send({
            message: `The position already exists for the user`
        });
    }
};

exports.findOne = (req, res) => {
    const profile = req.params.id;

    Position
        .find({profile})
        .then(data => {
            if (!data)
                res.status(404).send({
                    message: "Not found Position to user with id " + profile
                });
            else 
                res.send(data);
        })
        .catch(() => {
            res.status(500).send({
                message: "Error retrieving Position to user with id=" + profile
            });
        });
};

exports.findAll = (req, res) => {
    Position
        .find({})
        .then(data => {
            res.status(200).send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving profiles."
            });
        });
};

exports.update = (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: "Data to update can not be empty!"
        });
        return;
    }

    const profile = req.params.id;
    const dataToUpdate = { location: req.body };

    Position
        .findOneAndUpdate({ profile }, dataToUpdate)
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update Position to user with id=${profile}. Maybe Position was not found!`
                });
            } else {
                res.send({
                    message: "Position was updated successfully."
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error updating Position to user with id=" + profile
            });
        });
};

exports.delete = (req, res) => {
    const profile = req.params.id;

    Position
        .findOneAndDelete({ profile })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete Position to user with id=${profile}. Maybe Position was not found!`
                });
            } else {
                res.send({
                    message: "Position was deleted successfully!"
                });
            }
        })
        .catch(() => {
            res.status(500).send({
                message: "Could not delete Position to user with id=" + profile
            });
        });
};