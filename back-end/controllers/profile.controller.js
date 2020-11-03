const db = require('../models')
const Profile = db.profile;

exports.create = (req, res) => {
    // Validate request
    if (!req.body.name || !req.body.age || !req.body.email || !req.body.password) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }

    // Create a Profile instance
    const profile = new Profile({
        name: req.body.name,
        age: req.body.age,
        email: req.body.email
    });
    profile.password = Profile.generateHash(req.body.password);

    // Save Profile in the database
    profile
        .save()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the profile."
            });
        });
};

exports.findOne = (req, res) => {
    const id = req.params.id;

    Profile
        .findById(id)
        .then(data => {
            if (!data)
                res.status(404).send({
                    message: "Not found Profile with id " + id
                });
            else 
                res.send(data);
        })
        .catch(() => {
            res.status(500).send({
                message: "Error retrieving Profile with id=" + id
            });
        });
};

exports.findAll = (req, res) => {
    Profile
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

exports.login = (req, res) => {
    Profile
        .findOne({ email: req.body.email })
        .then(profile => {
            
            if (!profile) {
                return res.status(404).send({
                    message: "Profile not found!"
                });
            }

            if (!profile.validatePassword(req.body.password)) {
                res.status(400).send({
                    message: "Invalid password."
                });
            } else {
                res.status(200).send({
                    // Quando o usuário loga eu preciso saber quem é ele pra poder renderizar as telas de perfil
                    message: profile._id
                });
            }
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while trying authenticate."
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

    // Check and treats if password exists
    if (req.body.password) {
        const password = Profile.generateHash(req.body.password);
        
        if (!password) {
            return res.status(500).send({
                message: "Invalid password!"
            });
        }
        req.body.password = password;
    }

    const id = req.params.id;
    
    Profile
        .findByIdAndUpdate(id, req.body)
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update Profile with id=${id}. Maybe Profile was not found!`
                });
            } else {
                res.send({
                    message: "Profile was updated successfully."
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error updating Profile to user with id=" + id
            });
        });
};

exports.delete = (req, res) => {
    const id = req.params.id;

    Profile
        .findByIdAndDelete(id)
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete Profile with id=${id}. Maybe Profile was not found!`
                });
            } else {
                res.send({
                    message: "Profile was deleted successfully!"
                });
            }
        })
        .catch(() => {
            res.status(500).send({
                message: "Could not delete Profile with id=" + id
            });
        });
};