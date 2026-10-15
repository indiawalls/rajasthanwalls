import mongoose from 'mongoose';

const SiteSettingSchema = new mongoose.Schema(
    {
        key: { type: String, required: true, unique: true, index: true },
        value: { type: mongoose.Schema.Types.Mixed, required: true },
        description: { type: String, trim: true, default: '' },
    },
    { timestamps: true }
);

export default mongoose.models.SiteSetting || mongoose.model('SiteSetting', SiteSettingSchema);
