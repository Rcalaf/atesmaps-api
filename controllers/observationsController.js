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
    res.json(observations);
}

const createNewObservation = async (req, res) => {
    // if (!req?.body?.firstname || !req?.body?.lastname) {
    //     return res.status(400).json({ 'message': 'First and last names are required' });
    // }

    try {
        const result = await Observation.create({
            //firstname: req.body.firstname,
            //lastname: req.body.lastname
        });

        res.status(201).json(result);
    } catch (err) {
        console.error(err);
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
    if (!req?.body?.id) return res.status(400).json({ "message": 'User ID required' });
    const observation = await Observation.findOne({ _id: req.body.id }).exec();
    if (!observation) {
        return res.status(204).json({ 'message': `Observation ID ${req.body.id} not found` });
    }
    const result = await observation.deleteOne({ _id: req.body.id });
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