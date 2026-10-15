import mongoose from 'mongoose';

const AuthSecurityTrackerSchema = new mongoose.Schema({
    identifier: { type: String, required: true, unique: true, index: true }, // email
    passwordFailures: { type: Number, default: 0 },
    mfaFailures: { type: Number, default: 0 },
    isPasswordLocked: { type: Boolean, default: false },
    isMfaLocked: { type: Boolean, default: false },
    passwordResetToken: { type: String, default: null },
    passwordResetExpires: { type: Date, default: null },
    mfaResetOtp: { type: String, default: null },
    mfaResetOtpExpires: { type: Date, default: null },
    lastFailedAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.AuthSecurityTracker || mongoose.model('AuthSecurityTracker', AuthSecurityTrackerSchema);
