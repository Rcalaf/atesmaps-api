const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const observationSchema = new Schema({
    title: {
        type: String,
        required: false
    },
    date:{
        type: Date,
        required: false
    },
    location:{
        latitude: String,
        longitude: String,
    },
    
    status: {
        type: Number,
        default: 0,
    },
    observationTypes: {
        quick: {
            status: {
                type: Boolean,
                default: false
            },
            values: {
                ridingQuality: {
                    type: Number,
                },
                snowConditions: {
                    deepPowder:{
                        type: Boolean,
                        default: false
                    },
                    wet: {
                        type: Boolean,
                        default: false
                    },
                    crusty: {
                        type: Boolean,
                        default: false
                    },
                    powder: {
                        type: Boolean,
                        default: false
                    },
                    heavy: {
                        type: Boolean,
                        default: false
                    },
                    windyAffected: {
                        type: Boolean,
                        default: false
                    },
                    hard: {
                        type: Boolean,
                        default: false
                    },
                },
                rodeSlopeTypes:{
                    mellow: {
                        type: Boolean,
                        default: false,
                    },
                    convex:{
                        type: Boolean,
                        default: false,
                    },
                    alpine: {
                        type: Boolean,
                        default: false,
                    },
                    dense:{
                        type: Boolean,
                        default: false,
                    },
                    steep:{
                        type: Boolean,
                        default: false,
                    },
                    openTrees:{
                        type: Boolean,
                        default: false,
                    },
                    cut:{
                        type: Boolean,
                        default: false,
                    },
                    sunny:{
                        type: Boolean,
                        default: false,
                    }
                },
                avoidedSlopeTypes:{
                    alpine: {
                        type: Boolean,
                        default: false,
                    },
                    dense:{
                        type: Boolean,
                        default: false,
                    },
                    steep:{
                        type: Boolean,
                        default: false,
                    },
                    openTrees:{
                        type: Boolean,
                        default: false,
                    },
                    cut:{
                        type: Boolean,
                        default: false,
                    },
                    sunny:{
                        type: Boolean,
                        default: false,
                    }
                },
                dayType:{
                    warm: {
                        type: Boolean,
                        default: false,
                    },
                    foggy:{
                        type: Boolean,
                        default: false,
                    },
                    cloudy: {
                        type: Boolean,
                        default: false,
                    },
                    stormy:{
                        type: Boolean,
                        default: false,
                    },
                    windy:{
                        type: Boolean,
                        default: false,
                    },
                    cold: {
                        type: Boolean,
                        default: false,
                    },
                    wet: {
                        type: Boolean,
                        default: false,
                    },
                    sunny:{
                        type: Boolean,
                        default: false,
                    }
                },
                avalancheConditions:{
                    newConditions: {
                        type: Boolean,
                        default: false,
                    },
                    slabs:{
                        type: Boolean,
                        default: false,
                    },
                    sounds:{
                        type: Boolean,
                        default: false,
                    },
                    tempChanges:{
                        type: Boolean,
                        default: false,
                    }
                },
                otherComments:{
                    type: String,   
                }
            }
        },
        avalanche: {
            status: {
                type: Boolean,
                default: false
            }
        },
        snowpack: {
            status: {
                type: Boolean,
                default: false
            }
        },
        weather: {
            status: {
                type: Boolean,
                default: false
            }
        },
        incident: {
            status: {
                type: Boolean,
                default: false
            }
        }
    }

});


module.exports = mongoose.model('Observation', observationSchema);