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