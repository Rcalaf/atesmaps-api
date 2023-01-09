const Observation = require('../model/Observation');
const User = require('../model/User');
const GeoJSON = require('geojson');
const proj4 = require('proj4');
const { format } = require('date-fns');


const getAllObservations = async (req, res) => {
    const observations = await Observation.find();
    //if (!observations) return res.status(204).json({ 'message': 'No observations found' });
    res.json(observations);
}

const getUserObservations = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ "message": 'User ID required' });
    const user = await User.findOne({ _id: req.params.id }).populate('observations').exec();
    if (!user) return res.status(204).json({ 'message': 'No users found' });
    const observations = user.observations;
    console.log(user);
    res.json(observations);
}

const createNewObservation = async (req, res) => {
    console.log('This is a new oservation body received...')
    console.log(req.body.observationTypes.quick);
    const user = await User.findOne({ _id: req.body.user });
    if (!user) return res.status(204).json({ 'message': 'No users found' });
    req.body.user = user;
    req.body.status = 1; 
    req.body.location = { type: 'Point', coordinates: [req.body.location.latitude, req.body.location.longitude] };

    try {
        const result = await Observation.create(req.body);
        // console.log(result);
        // let obj = { title: result.title,
        //             date: result.date,
        //             location: result.location,
        //             status: result.status,
        //             result.submitted,
        //             result.sync,
        //             result.directoryId,
        //             result.pictures,
        //             result.observationTypes  
        // }
        user.observations.push(result.toObject({ getters: true }));
        await user.save();
        return res.status(201).json({'observations': user.observations, 'observationId': result._id});
    } catch (err) {
        console.error(err);
        res.status(500).json({ 'message': 'Error creating observation' });
    }
}

const updateObservation = async (req, res) => {
    if (!req?.body?.id) {
        return res.status(400).json({ 'message': 'ID parameter is required.' });
    }

    const observation = await Observation.findOne({ _id: req.body.id }).exec();
    if (!observation) {
        return res.status(204).json({ "message": `No observation matches ID ${req.body.id}.` });
    }

    const result = await observation.save();
    res.json(result);
}


const deleteObservation = async (req, res) => {
    // console.log('------ Observation Controller delete action -----');
    // console.log(req.body._id);
    // console.log('------ END Observation Controller delete action -----');
    if (!req.body?._id) return res.status(400).json({ "message": 'Observation ID required' });
    const observation = await Observation.findOne({ _id: req.body._id }).populate('user').exec();
    if (!observation) {
        return res.status(204).json({ 'message': `Observation ID ${req.body._id} not found` });
    }
    const result = await observation.remove();
    res.json(result);
}

const getObservation = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ "message": 'Observation ID required' });
    const observation = await Observation.findOne({ _id: req.params.id }).exec();
    if (!observation) {
        return res.status(204).json({ 'message': `Observation ID ${req.params.id} not found` });
    }
    res.json(observation);
}

const getFeatures = async (req, res) => {
    const box = [[parseFloat(req.query.transformedbbox[3]),parseFloat(req.query.transformedbbox[2])],[parseFloat(req.query.transformedbbox[1]),parseFloat(req.query.transformedbbox[0])]];
    let data = await Observation.find({location: {
        $geoWithin: {
            $box: box,
        }
    }}).populate('user');
    let features = [];
    data.forEach((feature)=>{
        //let transformedCoors = proj4(proj4.defs('EPSG:4326'),proj4.defs('EPSG:3857'),[feature.location.coordinates[1],feature.location.coordinates[0]]);
        features.push({
            "type": "Feature",
            "geometry": feature.location,
            "properties":{
                "type": "observation",
                "title":feature.title,
                "date":feature.date,
                "directoryId":feature.directoryId,
                "images":feature.images,
                "observationTypes":feature.observationTypes,
                "user": {
                    "username": feature.user.username,
                    "name": feature.user.name,
                    "lastName": feature.user.lastName,
                }
            }
        });
    })
    res.json({
        "type": "FeatureCollection",
        "crs": {
            "type": "name",
            "properties": {
              "name": "EPSG:4326",
            },
        },
        "numberMatched":features.length,
        "numberReturned":features.length,
        "timeStamp": new Date(),
        "totalFeatures":features.length,
        "features":features
    });
}

module.exports = {
    getAllObservations,
    getUserObservations,
    createNewObservation,
    updateObservation,
    deleteObservation,
    getObservation,
    getFeatures
}