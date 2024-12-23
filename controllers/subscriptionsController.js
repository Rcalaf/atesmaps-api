const User = require('../model/User');
const Subscription = require('../model/Subscription');
const { updateEmployee } = require('./employeesController');


const getAllSubscriptions = async (req, res) => {
    const subscriptions = await Subscription.find();
    if (!subscriptions) return res.status(204).json({ 'message': 'No subscriptions found' });
    res.json(subscriptions);
}


const getSubscription = async (req, res) => {
    console.log(req?.params?.id)
    if (!req?.params?.id) return res.status(400).json({ "message": 'Subscription ID required' });
    const subscription = await Subscription.findOne({ _id: req.params.id }).exec();
    if (!subscription) {
        return res.status(204).json({ 'message': `Subscription ID ${req.params.id} not found` });
    }
    res.json(subscription);
}

const getUserSubscriptions = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ "message": 'User ID required' });
    //console.log(req?.query?.page);
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
    const user = await User.findOne({ _id: req.params.id }).populate({path:'subscriptions',options}).exec();
    if (!user) return res.status(204).json({ 'message': 'No users found' });
    const subscriptions = user.subscriptions;
//  console.log(observations);
    res.json(subscriptions);
}

const createNewSubscription = async (req, res) => {
    // console.log('This is a new oservation body received...')
    console.log(req.body);
    console.log(req.params.id);

    let user = await User.findOne({ _id: req.params.id });
    if (!user) return res.status(204).json({ 'message': 'No users found' });
    req.body.user = user;
    console.log(req.body);
    try {
        const result = await Subscription.create(req.body);
        // console.log(req.body.observationTypes.snowpack);
        user.subscriptions.push(result.toObject({ getters: true }));
        user.pro = true;
        user.expiresAt = req.body.expiresAt;
        let saveResult = await user.save();
        // console.log(saveResult)
        return res.status(201).json({'subscriptions': user.subscriptions, 'subscriptionId': result._id});
    } catch (err) {
        console.log('error')
        console.error(err);
        res.status(500).json({ 'message': 'Error creating subscription' });
    }
}

const editSubscription = async (req, res) =>{
    const { id } = req.params;
    //console.log('------------edit user form body -------')
    console.log(req.body);
    console.log(id);
    if (!id) return res.status(400).json({ "message": 'Subscription ID required' });
    // console.log(id);
    let subscription = await Subscription.findOne({ _id: id }).exec();
    if (!subscription) {
        return res.status(204).json({ 'message': `Subscription ID ${id} not found` });
    }

    subscription = {...subscription,...req.body};
    subscription.save();

    try{
        // console.log('user saved')
         let response = await subscription.save();
 
       // console.log("----received from the app---");
         res.status(200).json(subscription);
    }catch (e){
         console.log(e);
         res.json({'message': e});
    }


}



module.exports = {
    getAllSubscriptions,  
    getUserSubscriptions,
    getSubscription,
    createNewSubscription,
    editSubscription,
}