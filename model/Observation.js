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

const observationSchema = new Schema({
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
    whenObsTaken:{
        type: Number
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
                customActivityType:{
                    type: String, 
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
                    shade:{
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
                    },
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
                    intenseSnow:{
                        type: Boolean,
                        default: false,
                    },
                    weakSnow:{
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
                    },
                    snowAccumulation:{
                        type: Boolean,
                        default: false,
                    },
                },
                comments:{
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
                geoAccuracy: {
                    type: Number,
                },
                amount: {
                    type: Number
                },
                obsType:{
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
                },
                comments:{
                    type: String,   
                }
            }
        },
        accident: {
            status: {
                type: Boolean,
                default: false
            },
            values: {
                activityType:{
                    type: Number
                },
                accidentOrigin:{
                    type: Number,
                    default: 1
                },
                customActivityType:{
                    type: String, 
                },
                numOfPeople:{
                    type: String, 
                },
                numOfBuried:{
                    type: String, 
                },
                numOfPartiallyBuried:{
                    type: String, 
                },
                numOfInjured:{
                    type: String, 
                },
                numOfSeverlyInjured:{
                    type: String, 
                },
                numOfDead:{
                    type: String, 
                },
                crackDepth:{
                    type: String, 
                },
                terrainType:{
                    type: Number
                },
                terrainTraps:{
                    type: Number
                },
                avalancheSize:{
                    size_1:{type: Boolean},
                    size_2:{type: Boolean},
                    size_3:{type: Boolean},
                    size_4:{type: Boolean},
                    size_5:{type: Boolean},
                },
                comments:{
                    type: String,   
                },
                contactMe: {
                    type: Boolean,
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
                geoAccuracy:{
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
                    type: Number
                },
                cracks: {
                    type: Number
                },
                layerSnowType: {
                    type_1: {type: Boolean},
                    type_2: {type: Boolean},
                    type_3: {type: Boolean},
                    type_4: {type: Boolean},
                    type_5: {type: Boolean},
                    type_6: {type: Boolean},
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
                    type_1: {type: Boolean},
                    type_2: {type: Boolean},
                    type_3: {type: Boolean},
                    type_4: {type: Boolean},
                    type_5: {type: Boolean},
                    type_6: {type: Boolean},
                },
                fractureDepth:{
                    type: String
                },fractureTypeCt: {
                    type_1: {type: Boolean},
                    type_2: {type: Boolean},
                    type_3: {type: Boolean},
                    type_4: {type: Boolean},
                    type_5: {type: Boolean},
                    type_6: {type: Boolean},
                },
                fractureDepthCt:{
                    type: String
                },
                layerHardness: {
                    type: Number
                },
                weakLayerHardness:{
                    type: Number
                },
                snowHumidity:{
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
            },
            values:{
                snowIntensity: {
                    type: Number
                },
                stormDate:{
                    type: String,
                },
                precipitationType: {
                    type: Number
                },
                skyCondition: {
                    type: Number
                },
                temp: {
                    type: String
                },
                rainIntensity: {
                    type: Number
                },
                tempChange: {
                    type: Number
                },
                maxTemp: {
                    type: String
                },
                minTemp: {
                    type: String
                },
                windSpeed: {
                    type: Number
                },

                windCarry: {
                    type: Number
                },
                snowAccumulation: {
                    type: String
                },
                rainAccumulation: {
                    type: String
                },
                snowAccumulation24: {
                    type: String
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
                comments:{
                    type: String
                }
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