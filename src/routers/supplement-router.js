import express from "express";
import Supplement from "../models/supplement.js";

const router = express.Router();

//create supplement

router.post("/api/supplement", async (req, res) => {
  const checkSupplement = await Supplement.findOne({
    supplementNo: req.body.supplementNo,
  });
  if (checkSupplement) {
    return res.send({
      error: "supplement alreday exist with the same name!",
    });
  }
  const newSupplement = new Supplement(req.body);
  try {
    await newSupplement.save();
    res.send(newSupplement);
  } catch (e) {
    res.send({ error: e });
  }
});

//read all supplements
router.get("/api/supplement", async (req, res) => {
  try {
    const supplements = await Supplement.find();
    // console.log(supplements);
    if (supplements.length === 0) {
      return res.send({ error: "No supplements available!" });
    }
    res.send(supplements);
  } catch (e) {
    res.send({ error: e });
  }
});

//read a supplement
router.get("/api/supplement:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const supplement = await Supplement.findById(_id);

    if (supplement.length === 0) {
      return res.send({ error: "No supplement available!" });
    }
    res.send(supplement);
  } catch (e) {
    res.send({ error: e });
  }
});

//update supplement

router.put("/api/supplement:id", async (req, res) => {
  const _id = req.params.id;

  try {
    const supplement = await Supplement.findByIdAndUpdate({ _id }, req.body, {
      new: true,
      runValidators: true,
    });
    if (supplement.length === 0) {
      return res.send({ error: "No supplement found!" });
    }
    res.send(supplement);
  } catch (e) {
    res.send({ error: e });
  }
});
//delete supplement

router.delete("/api/supplement:id", async (req, res) => {
  const _id = req.params.id;

  try {
    const supplement = await Supplement.findByIdAndDelete({ _id });
    if (supplement.length === 0) {
      return res.send({ error: "No supplement found!" });
    }
    res.send(supplement);
  } catch (e) {
    res.send({ error: e });
  }
});

export default router;
