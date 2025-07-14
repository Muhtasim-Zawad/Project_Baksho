import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },

    name: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },

    avatar: {
      type: String,
      default: ''
    },

    bio: {
      type: String,
      default: ''
    },

    location: {
      type: String,
      default: ''
    },

    website: {
      type: String,
      default: ''
    },

    socialMedia: {
      twitter: { type: String, default: '' },
      facebook: { type: String, default: '' },
      instagram: { type: String, default: '' },
      linkedin: { type: String, default: '' },
    },

    preferences: {
      type: [String], // Array of category names/ids
      default: [],
    },

    lastLogin: {
      type: Date,
      default: null
    },
    
    isBanned: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true, // Automatically adds createdAt & updatedAt
  }
);

// Pre-save middleware to hash password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare entered password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
