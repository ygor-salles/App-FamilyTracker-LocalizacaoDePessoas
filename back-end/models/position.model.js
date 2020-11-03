module.exports = (mongoose) => {
    const pointSchema = mongoose.Schema({
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    });

    let schema = mongoose.Schema({
        location: {
            type: pointSchema,
            required: true
        },
        profile: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'profiles',
            required: true
        },
        __v: {
            type: Number,
            select: false
        }
    });

    const Position = mongoose.model('positions', schema);

    return Position;
};