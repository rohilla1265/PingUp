import mongoose from "mongoose";

const connectionSchema = new mongoose.Schema({
    from_user_id: {
        type: mongoose.Schema.Types.ObjectId, // Use ObjectId instead of String
        ref: 'User', // Capitalized model name convention
        required: true
    },
    to_user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected', 'blocked'], // Added more status options
        default: 'pending'
    }
}, {
    timestamps: true
});

// Add compound index to prevent duplicate connections
connectionSchema.index({ from_user_id: 1, to_user_id: 1 }, { unique: true });

// Add index for efficient querying by status
connectionSchema.index({ status: 1 });

// Virtual for populated user data (optional)
connectionSchema.virtual('from_user', {
    ref: 'User',
    localField: 'from_user_id',
    foreignField: '_id',
    justOne: true
});

connectionSchema.virtual('to_user', {
    ref: 'User',
    localField: 'to_user_id',
    foreignField: '_id',
    justOne: true
});

// Set to include virtuals in JSON output
connectionSchema.set('toJSON', { virtuals: true });

const Connection = mongoose.model('Connection', connectionSchema);
export default Connection;