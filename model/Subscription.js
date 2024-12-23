
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subscriptionSchema = new Schema({
    type: {
        type: String,
        required: false
    },
    status: {
        type: String,
        required: true
    },
    expiresAt:{
        type: Number,
        required: false
    },
    stripeId: {
        type: String,
        required: true,
        unique: true,
    },
    invoiceId:{
        type: String,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
});

subscriptionSchema.pre('remove', function(next) { 
    console.log('remove subscription from users after deletion')
    let index = this.user.payments.indexOf(this._id);
    if (index > -1) { 
        this.user.subscriptions.splice(index, 1); 
        this.user.save();
    }
    next();
});

module.exports = mongoose.model('Subscription', subscriptionSchema);