const db = require('../models')
const Family = db.family;
const Profile = db.profile;
const Position = db.position;

exports.create = async (req, res) => {
    // Validate request
    if (!req.body.surname) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }

    // Create a Family instance
    const family = new Family({
        surname: req.body.surname
    });

    let familyAlreadyExists = await Family
        .findOne({surname: req.body.surname})

    if (!familyAlreadyExists) {
        // Save Family in the database
        family
            .save()
            .then(data => {
                res.send(data);
            })
            .catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while creating the family."
                });
            });
    } else {
        res.status(500).send({
            message: `The family already exists!`
        });
    }
};

exports.findOne = (req, res) => {
    const id = req.params.id;

    Family
        .findById(id)
        .then(async family => {
            if (!family)
                res.status(404).send({
                    message: "Not found Family with id " + id
                });
            else {
                let membersFamily = await Profile.find({family: family._id}).select('+name -_id');
                let members = [];

                for (const member of membersFamily) {
                    members.push({
                        name: member.name,
                        age: member.age
                    });
                }

                res.send({_id: family._id, surname: family.surname, members});
            }
        })
        .catch(() => {
            res.status(500).send({
                message: "Error retrieving Family with id=" + id
            });
        });
};

exports.findAll = (req, res) => {
    Family
        .find({})
        .then(data => {
            res.status(200).send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving families."
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

    const id = req.params.id;

    Family
        .findByIdAndUpdate(id, req.body)
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update Family with id=${id}. Maybe Family was not found!`
                });
            } else {
                res.send({
                    message: "Family was updated successfully."
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error updating Family with id=" + id
            });
        });
};

exports.delete = (req, res) => {
    const id = req.params.id;

    Family
        .findByIdAndDelete(id)
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete Family with id=${id}. Maybe Family was not found!`
                });
            } else {
                res.send({
                    message: "Family was deleted successfully!"
                });
            }
        })
        .catch(() => {
            res.status(500).send({
                message: "Could not delete Family with id=" + id
            });
        });
};

exports.findAllPositionOfOneFamily = async (req, res) => {
    const profile = req.params.id;
    let familyWithPositions = [];

    let profileData = await Profile.findById(profile).select('family');

    if (profileData && profileData.family) {
        let membersFamily = await Profile.find({family: profileData.family});

        for (const member of membersFamily) {
            let position = await Position.findOne({profile: member._id}).select('+location.coordinates -_id');

            familyWithPositions.push({
                profile: member._id,
                name: member.name,
                coordinates: position.location.coordinates
            });
        }

        res.status(200).send(familyWithPositions);
    } else {
        res.status(404).send({
            message: `Cannot found Family with profile id=${profile}. Maybe Family was not found!`
        });
    }
};