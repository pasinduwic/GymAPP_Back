import express from "express";
import Payment from "../models/payments.js";
import Client from "../models/client.js";
import SupplementPayment from "../models/supplementPayments.js";
import Supplement from "../models/supplement.js";
import axios from "axios";
import env from "dotenv";

const router = express.Router();

//create payment

// client
router.post("/api/payment", async (req, res) => {
  const newPayment = new Payment(req.body);
  try {
    const client = await Client.findById(newPayment.client);
    // console.log(client);
    if (!client) {
      return res.send({ error: "Client not found!" });
    }
    if (newPayment.nextPaymentDate) {
      client.nextPaymentDate = newPayment.nextPaymentDate;
    }
    if (client.type === 3) {
      const partner = await Client.findById(client.partner);
      if (partner) {
        partner.nextPaymentDate = newPayment.nextPaymentDate;
        await partner.save();
      }
    }

    // console.log(client);
    await client.save();
    await newPayment.save();

    if (newPayment.type != 6) {
      // After payment is saved, send SMS using the Notify.lk API
      let phoneNumber = client.phoneNumber;
      phoneNumber = String(phoneNumber);
      if (phoneNumber.startsWith("0")) {
        phoneNumber = "94" + phoneNumber.slice(1);
      } else {
        phoneNumber = "94" + phoneNumber;
      }

      const smsUrl = `https://app.notify.lk/api/v1/send?
                      user_id=29081&api_key=5NQPpqHnWGUmjtKjBecH&sender_id=SD Fitness&to=${phoneNumber}
                      &message=Your payment of Rs ${newPayment.amount} has been successfully processed. You will receive a reminder one day before membership expires.%0A%0AThank you!`;

      // console.log(smsUrl);
      try {
        const smsResponse = await axios.get(smsUrl); // Make the API call to Notify.lk
        if (smsResponse.data.status === "success") {
          console.log("SMS sent successfully!");
        } else {
          console.log("Failed to send SMS:", smsResponse.data);
        }
      } catch (smsError) {
        console.error("Error sending SMS:", smsError.message);
      }
    }
    res.send(newPayment);
  } catch (e) {
    res.send({ error: e });
  }
});

// supplement
router.post("/api/paymenSupplemnt", async (req, res) => {
  const newPayment = new SupplementPayment(req.body);
  try {
    await newPayment.save();
    const supplement = await Supplement.findById(newPayment.supplement._id);
    supplement.availableStock = supplement.availableStock - newPayment.quantity;
    await supplement.save();

    res.send(newPayment);
  } catch (e) {
    res.send({ error: e });
  }
});

//read all payments
router.get("/api/payment", async (req, res) => {
  try {
    const payments = await Payment.find().populate("client");
    if (payments.length === 0) {
      return res.send({ error: "No payments available!" });
    }
    res.send(payments);
  } catch (e) {
    res.send({ error: e });
  }
});
//read a payment
router.get("/api/payment:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const payment = await Payment.findById(_id).populate("client");

    if (payment.length === 0) {
      return res.send({ error: "No payment available!" });
    }
    res.send(payment);
  } catch (e) {
    res.send({ error: e });
  }
});

// SupplementPayment
router.get("/api/paymenSupplemnt", async (req, res) => {
  try {
    const payments = await SupplementPayment.find().populate("supplement");
    console.log(payments);
    if (payments.length === 0) {
      return res.send({ error: "No payments available!" });
    }

    res.send(payments);
  } catch (e) {
    console.log(e);
    res.send({ error: e });
  }
});

//update payment

router.put("/api/payment:id", async (req, res) => {
  const _id = req.params.id;

  try {
    const payment = await Payment.findByIdAndUpdate({ _id }, req.body, {
      new: true,
      runValidators: true,
    });
    if (payment.length === 0) {
      return res.send({ error: "No payment found!" });
    }
    const client = await Client.findById(payment.client);
    // console.log(client);
    client.nextPaymentDate = payment.nextPaymentDate;
    // console.log(client);
    await client.save();
    res.send(payment);
  } catch (e) {
    res.send({ error: e });
  }
});
//delete payment

router.delete("/api/payment:id", async (req, res) => {
  const _id = req.params.id;
  // console.log(_id);
  try {
    const payment = await Payment.findByIdAndDelete({ _id });
    if (payment.length === 0) {
      return res.send({ error: "No payment found!" });
    }
    res.send(payment);
  } catch (e) {
    res.send({ error: e });
  }
});

router.delete("/api/paymenSupplemnt:id", async (req, res) => {
  const _id = req.params.id;
  // console.log(_id);
  try {
    const payment = await SupplementPayment.findByIdAndDelete({ _id }).populate(
      "supplement"
    );
    if (payment.length === 0) {
      return res.send({ error: "No payment found!" });
    }
    const supplement = await Supplement.findById(payment.supplement._id);
    supplement.availableStock = supplement.availableStock + payment.quantity;
    await supplement.save();
    res.send(payment);
  } catch (e) {
    res.send({ error: e });
  }
});

export default router;
