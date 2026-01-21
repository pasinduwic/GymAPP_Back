import { Schema, model } from "mongoose";
import { gymDb } from "../db/mongoose.js";

const supplementSchema = Schema({
  supplementNo: {
    type: Number,
    required: true,
  },
  supplementName: {
    type: String,
    required: true,
  },
  supplementCategory: {
    //1-protine,2-pre,3-creatine,4-fatb,5-vitamins
    type: Number,
    required: true,
  },
  weight: {
    type: Number,
  },
  availableStock: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: true,
  },
  sellingPrice: {
    type: Number,
  },
  status: {
    type: Boolean,
  },
});

const Supliment = gymDb.model("Supliment", supplementSchema);
export default Supliment;
