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
        latitude: Number,
        longitude: Number,
    },
    status: {
        type: Number,
        default: 0,
    },
    submitted:{
        type: Boolean,
        default: false
    },
    sync: {
        type: Boolean,
        default: true
    },
    directoryId: {
        type: String,
    },
    images: [{
        type: String,
    }],
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
                activityType: {
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
                    clear:{
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
            },
            values: {
                date: {
                    type: Date,
                },
                when: {
                    type: Number,
                },
                amount: {
                    type: Number
                },
                dangerLevel:{
                    level_1:{type: Boolean},
                    level_2:{type: Boolean},
                    level_3:{type: Boolean},
                    level_4:{type: Boolean},
                    level_5:{type: Boolean},
                },
                avalancheType:{
                    type_1:{type: Boolean},
                    type_2:{type: Boolean},
                    type_3:{type: Boolean},
                    type_4:{type: Boolean},
                    type_5:{type: Boolean},
                    type_6:{type: Boolean},
                    type_7:{type: Boolean},
                    type_8:{type: Boolean},
                    type_9:{type: Boolean},
                },
                depth:{
                    type: String,
                },
                width:{
                    type: String,
                },
                length:{
                    type: String
                },
                trigger:{
                    type: Number
                },
                height:{
                    type:String
                },
                inclination:{
                    type: String
                },
                heightRange:{
                    range_1:{type: Boolean},
                    range_2:{type: Boolean},
                    range_3:{type: Boolean},
                    range_4:{type: Boolean},
                },
                orientation:{
                    N:{type: Boolean},
                    NE:{type: Boolean},
                    E:{type: Boolean},
                    SE:{type: Boolean},
                    S:{type: Boolean},
                    SO:{type: Boolean},
                    O:{type: Boolean},
                    NO:{type: Boolean},
                },
                snowType:{
                    type:String
                },
                windExposure: {
                    type: Number
                }
            }
        },
        snowpack: {
            status: {
                type: Boolean,
                default: false
            },
            values: {
                observationType:{
                    type: Number
                },
                altitudeRange: {
                    range_1: {type: Boolean},
                    range_2: {type: Boolean},
                    range_3: {type: Boolean},
                    range_4: {type: Boolean},
                },
                altitude:{
                    type: String, 
                },
                orientation:{
                    N:{type: Boolean},
                    NE:{type: Boolean},
                    E:{type: Boolean},
                    SE:{type: Boolean},
                    S:{type: Boolean},
                    SO:{type: Boolean},
                    O:{type: Boolean},
                    NO:{type: Boolean},
                },
                depth: {
                    type: String
                },
                woumpfs: {
                    type: Boolean
                },
                sounds: {
                    type: Boolean
                },
                layerSnowType: {
                    type: Number
                },
                footPenetration: {
                    type: String
                },
                skiPenetration: {
                    type: String
                },
                handTest:{
                    type: Number
                },
                compresionTest:{
                    type: Number
                },
                extensionTest: {
                    type: Number
                },
                fractureType: {
                    type: Number
                },
                fractureDepth:{
                    type: String
                },
                layerHardness: {
                    type: Number
                },
                layerHumidity:{
                    type: Number
                },
                snowType:{
                    type: String
                },
                comments:{
                    type: String
                }

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
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }

});

observationSchema.pre('remove', function(next) { 
    let index = this.user.observations.indexOf(this._id);
    if (index > -1) { 
        this.user.observations.splice(index, 1); 
        this.user.save();
    }
    next();
});


module.exports = mongoose.model('Observation', observationSchema);