const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const crypto = require('crypto');

const userSchema = new Schema({
    username: {
        type: String,
        required: false
    },
    email:{
        type: String,
        required: true
    },
    roles: {
        User: {
            type: Number,
            default: 2001
        },
        Editor: Number,
        Admin: Number
    },
    restPasswordToken: String,
    resetPasswordExpires: Date,
    password: {
        type: String,
        required: true
    },
    refreshToken: String,
    observations: [{
        type: Schema.Types.ObjectId,
        ref: "Observation",
        required: false
    }]
});

userSchema.methods.generatePasswordReset = function() {
    this.resetPasswordToken = crypto.randomBytes(20).toString('hex');
    this.resetPasswordExpires = Date.now() + 3600000; //expires in an hour
};

module.exports = mongoose.model('User', userSchema);