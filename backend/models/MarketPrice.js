import mongoose from "mongoose";

const marketPriceSchema = new mongoose.Schema(
{
    crop: {
        type: String,
        required: true
    },

    market: {
        type: String,
        required: true
    },

    state: {
        type: String,
        required: true
    },

    district: {
        type: String,
        required: true
    },

    arrivalQuantity: {
        type: Number,
        default: 0
    },

    minPrice: {
        type: Number,
        required: true
    },

    maxPrice: {
        type: Number,
        required: true
    },

    modalPrice: {
        type: Number,
        required: true
    },

    date: {
        type: Date,
        default: Date.now
    }
},
{
    timestamps: true
}
);

const MarketPrice = mongoose.model("MarketPrice",marketPriceSchema);

export default MarketPrice;