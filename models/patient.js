const mongoose = require('mongoose'),
      {Service} = require('./service'),
      Transaction = require('./transaction'),
      Schema = mongoose.Schema;

const PatientSchema = new Schema({
    name: { type: String, required:true },
    phone: { type: Number},
    cuarto:{type:String},
    payed:{type:Boolean, default: false},
    edad:{type:Number},
    email: { type: String},
    address: { type: String},
    rfc: { type: String },
    diagnosis: { type: String},
    treatingDoctor: { type: String },
    serviceType: { type: String,default:'Hospitalizacion'},
    admissionDate: { type: Date, default: Date.now},
    chargedDate: { type: Date, default: Date.now},
    discharged: { type: Boolean, default: false},
    dischargedDate:{ type: Date},
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    receivedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    totalReceived:{type:Number, default:0.0},
    servicesCar: [ {
            type: Schema.Types.ObjectId,
            ref: "Transaction"
        }
    ]
});

module.exports = mongoose.model("Patient", PatientSchema)

