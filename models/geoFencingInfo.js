import mongoose from "mongoose";
import { Schema } from "mongoose";

const geofenceLocationSchema = new Schema({
    latitude: {
        type: Number,
        required: true,
    },
    longitude: {
        type: Number,
        required: true,
    },
    radius: {
        type: Number,
        required: true,
    },
    changeByUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

const GeofenceLocation = mongoose.models.GeofenceLocation || mongoose.model("GeofenceLocation", geofenceLocationSchema);

export default GeofenceLocation;
