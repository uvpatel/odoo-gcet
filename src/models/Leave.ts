// name,id,department,position,startDate,endDate,status

import mongoose, {Schema}  from "mongoose"


const LeaveSchema: Schema = new Schema({
    name: {type: String, required: true},
    id: {type: String, required: true, unique: true},
    department: {type: String, required: true},
    position: {type: String, required: true},
    reason: {type: String, required: true},
    startDate: {type: Date, required: true},
    endDate: {type: Date, required: true},
    status: {type: String, required: true, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending'},
}, {timestamps: true})

export default mongoose.model('Leave', LeaveSchema) || mongoose.model('Leave', LeaveSchema)