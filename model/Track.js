const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pointSchema = new mongoose.Schema({
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
      required: true
    },
    coordinates: {
      type: [Number],
      index: '2dsphere',
      required: true
    },
    // index: '2dsphere',
});

const trackSchema = new Schema({
    title: {
        type: String,
        required: false
    },
    date:{
        type: Date,
        required: false
    },
    location: {
        type: pointSchema,
        index: '2dsphere',
        required: true
    },
    status: {
        type: Number,
        default: 0,
    },
    directoryId: {
        type: String,
    },
    images: [{
        type: String,
    }],
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }

});

trackSchema.pre('remove', function(next) { 
    let index = this.user.tracks.indexOf(this._id);
    if (index > -1) { 
        this.user.tracks.splice(index, 1); 
        this.user.save();
    }
    next();
});


module.exports = mongoose.model('Track', trackSchema);