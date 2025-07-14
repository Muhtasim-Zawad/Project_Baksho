import bcrypt from 'bcryptjs'
import User from "../models/User.js";

export const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);

        if (!user) return res.status(404).json({ message: 'User not FOUND!!' });

        const resUser = user.toObject();
        delete resUser.password;

        res.status(200).json(resUser);
    } catch (error) {
        console.log(error.message);
        res.json({ message: `Error: ${error.message}` })
    }
}

export const updateUserProfile = async (req, res) => {
    const loggedInUser = req.user;
    const {
        name,
        bio,
        location,
        website,
        avatar,
        preferences,
        socialMedia
    } = req.body;


    try {
        const existingUser = await User.findById(loggedInUser._id);
        if (!existingUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const updatedFields = {
            ...(name && { name }),
            ...(bio && { bio }),
            ...(location && { location }),
            ...(website && { website }),
            ...(avatar && { avatar }),
            ...(Array.isArray(preferences) && { preferences }),
            ...(socialMedia && typeof socialMedia === 'object' && { socialMedia }),
            updatedAt: new Date()
        };

        const result = await User.updateOne(
            { _id: loggedInUser._id },
            { $set: updatedFields }
        );

        res.status(200).json({ message: 'Profile updated successfully', result });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message });
    }
};



export const changePasswordByUser = async (req, res) => {
    const user = req.user;
    const { oldPassword, newPassword } = req.body;


    try {
        const existingUser = await User.findById(user._id)
        if (!existingUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await existingUser.matchPassword(oldPassword);
        if (!isMatch) {
            return res.status(401).json({ message: 'Old password is incorrect' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        existingUser.password = hashedPassword;

        await existingUser.save();
        console.log(existingUser);
        res.status(200).json({ message: 'Password updated successfully!' });

    } catch (error) {
        console.error('Password change error:', error);
        res.status(500).json({ message: 'Server error while updating password' });
    }
}

export const deactivateProfile = async (req, res) => {
    const loggedInUser = req.user;
    try {
        await User.findByIdAndDelete(loggedInUser._id);
        res.json({ message: 'Account Deleted Successfully!!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


export const getAllUsersByAdmin = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const banUserByAdmin = async (req, res) => {
    const { id } = req.body;
    try {
        await User.findOneAndUpdate({ _id: id }, { $set: { isBanned: true } });
        res.status(200).json({ message: "User banned successfully!!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
