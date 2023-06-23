const mongoose = require("mongoose"),
	  {Service} = require("./service"),
	  Disch = require("./discharged_data"),
	  MoneyBox = require('./money_parts'),
	//   Patient = require("./patient"),
	  Schema = mongoose.Schema;

const TransactionSchema = new Schema({
	patient: {
		type: Schema.Types.ObjectId,
		ref: "Patient"
	},
	location:{
		type: String
	},
	service:{
		type: Schema.Types.ObjectId,
		ref: "Service"
	},
	amount: { type: Number },
	consumtionDate: { type:Date },
	addedBy: { 
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	terminalDate:{ 
		type: Date, 
		default: null
	},
	discount: {
		type: Number,
		default: 0
	},
	toggle:{
		type:Boolean,	
		default:true
	},
	relatedBoxes: [{ type: Schema.Types.ObjectId, ref: 'MoneyBox' }],
	discharged_data:{
		type: Schema.Types.ObjectId,
		ref: 'Disch'
	}
});
module.exports = mongoose.model("Transaction", TransactionSchema)