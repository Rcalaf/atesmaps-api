const Observation = require('../model/Observation');
const User = require('../model/User');


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
    // if (!req?.body?.firstname || !req?.body?.lastname) {
    //     return res.status(400).json({ 'message': 'First and last names are required' });
    // }
    const user = await User.findOne({ _id: req.body.user });
    if (!user) return res.status(204).json({ 'message': 'No users found' });
    req.body.user = user;

    try {
        const result = await Observation.create(req.body);
        user.observations.push(result.toObject({ getters: true }));
        await user.save();
        return res.status(201).json(result);
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
    if (req.body?.firstname) employee.firstname = req.body.firstname;
    if (req.body?.lastname) employee.lastname = req.body.lastname;
    const result = await observation.save();
    res.json(result);
}


const deleteObservation = async (req, res) => {
    console.log('------ Observation Controller delete action -----');
    console.log(req.body._id);
    console.log('------ END Observation Controller delete action -----');
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

module.exports = {
    getAllObservations,
    getUserObservations,
    createNewObservation,
    updateObservation,
    deleteObservation,
    getObservation,
}