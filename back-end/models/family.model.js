module.exports = (mongoose) => {
    let schema = mongoose.Schema({
        surname: String,
        __v: {
            type: Number,
            select: false
        }
    });

    const Family = mongoose.model('families', schema);

    return Family;
};