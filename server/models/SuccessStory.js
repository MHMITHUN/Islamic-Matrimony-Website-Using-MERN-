const mongoose = require('mongoose');

const successStorySchema = new mongoose.Schema({
    selfBiodataId: {
        type: Number,
        required: true
    },
    partnerBiodataId: {
        type: Number,
        required: true
    },
    coupleImage: {
        type: String,
        required: true
    },
    marriageDate: {
        type: Date,
        required: true
    },
    reviewStar: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    successStoryText: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    maleBiodataId: {
        type: Number
    },
    femaleBiodataId: {
        type: Number
    }
}, {
    timestamps: true
});

// Pre-save hook to set male/female biodata IDs
successStorySchema.pre('save', async function (next) {
    if (!this.maleBiodataId || !this.femaleBiodataId) {
        const Biodata = require('./Biodata');

        const selfBiodata = await Biodata.findOne({ biodataId: this.selfBiodataId });
        const partnerBiodata = await Biodata.findOne({ biodataId: this.partnerBiodataId });

        if (selfBiodata && partnerBiodata) {
            if (selfBiodata.biodataType === 'Male') {
                this.maleBiodataId = this.selfBiodataId;
                this.femaleBiodataId = this.partnerBiodataId;
            } else {
                this.femaleBiodataId = this.selfBiodataId;
                this.maleBiodataId = this.partnerBiodataId;
            }
        }
    }
    next();
});

module.exports = mongoose.model('SuccessStory', successStorySchema);
