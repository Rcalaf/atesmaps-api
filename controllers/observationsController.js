const Observation = require('../model/Observation');
const User = require('../model/User');
const GeoJSON = require('geojson');
const proj4 = require('proj4');
const { format } = require('date-fns');


const getAllObservations = async (req, res) => {
    let observations = null;
    console.log(req.query);
    if(req.query.days && req.query.long && req.query.lat ){
        //Both days & location filter.
        var endDate = new Date();
        var startDate = new Date();
        var day = endDate.getDate() - Number(req.query.days);
        startDate.setDate(day);
        observations = await Observation.find({
            $and:[
                {date: { $gte: startDate }},
                {location: {$near: 
                    {$geometry: {
                        type: 'Point',
                        coordinates: [req.query.long, req.query.lat]
                    },
                    $maxDistance: 15000,
                }}}
            ]}).sort({date: 'desc'}).populate('user');
    }else if(req.query.days && !(req.query.long && req.query.lat)){
        //Only days filter.
        var endDate = new Date();
        var startDate = new Date();
        var day = endDate.getDate() - Number(req.query.days);
        startDate.setDate(day);
        observations = await Observation.find({
            $and:[
                {date: { $gte: startDate }}
            ]}).sort({date: 'desc'}).populate('user');
    }else if(!req.query.days && (req.query.long && req.query.lat)){
        //Only Location filter.
        observations = await Observation.find({
            $and:[
                {location: {$near: 
                    {$geometry: {
                        type: 'Point',
                        coordinates: [req.query.long, req.query.lat]
                    },
                    $maxDistance: 15000,
                }}}
            ]}).sort({date: 'desc'}).populate('user');
    }else{
        //No filter.
        observations = await Observation.find().sort({date: 'desc'});
    }
    // console.log(observations.length)
    // if (!observations) return res.status(204).json({ 'message': 'No observations found' });
    res.json(observations);
}

const getUserObservations = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ "message": 'User ID required' });
    console.log(req?.query?.page);
    //TODO: add pagination filter +  Date filter
    const limit = 5;
    let options = {}
    if(req?.query?.page){
        //let page = (!req?.query?.page ? req?.query?.page : 1);
        options = { limit: limit, skip: limit*(req.query.page-1), sort: [{"date": "desc" }] };
    }else{
        options = { sort: [{"date": "desc" }] };
    }
    console.log(options)
    const user = await User.findOne({ _id: req.params.id }).populate({path:'observations',options}).exec();
    if (!user) return res.status(204).json({ 'message': 'No users found' });
    const observations = user.observations;
//  console.log(observations);
    res.json(observations);
}

const createNewObservation = async (req, res) => {
    // console.log('This is a new oservation body received...')
    // console.log(req.body.observationTypes.quick);
    const user = await User.findOne({ _id: req.body.user });
    if (!user) return res.status(204).json({ 'message': 'No users found' });
    req.body.user = user;
    req.body.status = 1; 
    req.body.location = { type: 'Point', coordinates: [  req.body.location.longitude, req.body.location.latitude] };
    try {
        const result = await Observation.create(req.body);
        // console.log(req.body.observationTypes.snowpack);
        user.observations.push(result.toObject({ getters: true }));
        let saveResult = await user.save();
        // console.log(saveResult)
        return res.status(201).json({'observations': user.observations, 'observationId': result._id});
    } catch (err) {
        console.log('error')
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
    const box = [[parseFloat(req.query.transformedbbox[0]),parseFloat(req.query.transformedbbox[1])],[parseFloat(req.query.transformedbbox[2]),parseFloat(req.query.transformedbbox[3])]];
    // const box = [[parseFloat(req.query.transformedbbox[3]),parseFloat(req.query.transformedbbox[2])],[parseFloat(req.query.transformedbbox[1]),parseFloat(req.query.transformedbbox[0])]];
    let data = await Observation.find({$and:[{date: { $gte: new Date(req.query.startDate), $lte: new Date(req.query.endDate)}, location: {
        $geoWithin: {
            $box: box,
        }
    }}]}).sort({date: 'desc'}).populate('user');
    // console.log('--------')
    // console.log(data);
    // console.log('--------')
    let features = [];
    data.forEach((feature)=>{
        let terrainScore = 0;
        let userTa =  -1;
        let userRa =  -1;
        if(feature.user){
            switch(feature.user.terrainType) {
                case 1:
                    terrainScore = 0.5
                break;
                case 2:
                    terrainScore = 1
                break;
                case 3:
                    terrainScore = 3
                break;
                default:
                    terrainScore = 0
            }
            //let transformedCoors = proj4(proj4.defs('EPSG:4326'),proj4.defs('EPSG:3857'),[feature.location.coordinates[1],feature.location.coordinates[0]]);
            userTa = (feature.user.professionalOrientation-1)+(feature.user.snowEducationLevel-1)+(feature.user.snowExperienceLevel*terrainScore);
            userRa = feature.user.avalanchExposure + feature.user.conditionsType;
        }else{
            terrainScore = -1;
        }
      
        // console.log(feature.user);
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
                    "username": feature.user ? feature.user.username : "annonymous",
                    "name": feature.user ? feature.user.name : "annonymous",
                    "lastName": feature.user ? feature.user.lastName : "annonymous",
                    "Ta": userTa,
                    "Ra": userRa,
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