const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

module.exports = (mongoose) => {
    let schema = mongoose.Schema({
        name: {
            type: String,
            required: true,
            trim: true
        },
        age: {
            type: Number,
            required: true
        },
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            lowercase: true
        },
        password: {
            type: String,
            required: true,
            trim: true
        },
        family: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'families'
        },
        __v: {
            type: Number,
            select: false
        }
    });

    schema.statics.generateHash = function (password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(SALT_ROUNDS));
    };

    // Authenticate without save salt on database
    schema.methods.validatePassword = function (password) {
        return bcrypt.compareSync(password, this.password);
    };

    const Profile = mongoose.model('profiles', schema);

    return Profile;
};