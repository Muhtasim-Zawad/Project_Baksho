import User from "../models/User.js";

export const getUserById = async(req, res) => {
    const {id} = req.params;
    try {
        const user = await User.findOne({_id: id});
        
        if(!user) return res.status(404).json({message: 'User not FOUND!!'});

        const resUser = user.toObject();
        delete resUser.password;

        res.status(200).json(resUser);
    } catch (error) {
        console.log(error.message);
        res.json({message: `Error: ${error.message}`})
    }
}

export const updateUserProfile = async(req, res) => {
    const {id} = req.params;
    const newProfile = req.body;

    try {
        const user = await User.findOne({_id: id});
        if(!user) return res.json({message: 'User not found'});

        const result = await User.updateOne({_id: id}, {$set: {...newProfile, updatedAt: new Date()}})
        res.json(result);
    } catch (error) {
        console.log(error.message);
        res.send({error: error.message});
    }
}