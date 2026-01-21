import { Schema, model } from "mongoose";
import { gymDb } from "../db/mongoose.js";

const supplementPaymentSchema = Schema({
  supplement: {
    type: Schema.Types.ObjectId,
    ref: "Supliment",
  },
  quantity: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const SuplimentPayment = gymDb.model(
  "SuplimentPayment",
  supplementPaymentSchema
);
export default SuplimentPayment;
