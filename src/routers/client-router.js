import express from "express";
import axios from "axios";
import Client from "../models/client.js";

const router = express.Router();

//create client

router.post("/api/client", async (req, res) => {
  const checkClient = await Client.findOne({
    phoneNumber: req.body.phoneNumber,
  });
  if (checkClient) {
    return res.send({
      error: "Client alreday exist with the same phone number!",
    });
  }

  const newClient = new Client(req.body);
  try {
    if (newClient.type === 3 && newClient.partner) {
      const checkPartner = await Client.findById(newClient.partner);
      if (checkPartner) {
        newClient.nextPaymentDate = checkPartner.nextPaymentDate;
        checkPartner.partner = newClient._id;
      }
      // console.log(checkPartner);
      // console.log(newClient);
      await checkPartner.save();
    }

    await newClient.save();

    // After client is saved, send SMS using the Notify.lk API
    let phoneNumber = newClient.phoneNumber;
    phoneNumber = String(phoneNumber);
    if (phoneNumber.startsWith("0")) {
      phoneNumber = "94" + phoneNumber.slice(1);
    } else {
      phoneNumber = "94" + phoneNumber;
    }

    const smsUrl = `https://app.notify.lk/api/v1/send?
                      user_id=29081&api_key=5NQPpqHnWGUmjtKjBecH&sender_id=NotifyDEMO&to=${phoneNumber}
                      &message=Welcome SD Fitness!!!%0A%0AWe're excited to help you get in the best shape of your life!%0A%0AThank you!`;

    // console.log(smsUrl);
    try {
      // const smsResponse = await axios.get(smsUrl); // Make the API call to Notify.lk
      // if (smsResponse.data.status === "success") {
      //   console.log("SMS sent successfully!");
      // } else {
      //   console.log("Failed to send SMS:", smsResponse.data);
      // }
    } catch (smsError) {
      console.error("Error sending SMS:", smsError.message);
    }

    res.send(newClient);
  } catch (e) {
    res.send({ error: e });
    console.log(e);
  }
});

//read all clients
router.get("/api/client", async (req, res) => {
  try {
    const clients = await Client.find()
      .populate("assignedCoach")
      .populate("partner");
    if (clients.length === 0) {
      return res.send({ error: "No clients available!" });
    }
    // console.log(clients);
    res.send(clients);
  } catch (e) {
    res.send({ error: e });
    console.log(e);
  }
});
//read a client
router.get("/api/client:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const client = await Client.findById(_id)
      .populate("assignedCoach")
      .populate("partner");

    if (client.length === 0) {
      return res.send({ error: "No client available!" });
    }
    res.send(client);
  } catch (e) {
    res.send({ error: e });
  }
});

//update Client

router.put("/api/client:id", async (req, res) => {
  const _id = req.params.id;

  // console.log(req.body);
  try {
    const client = await Client.findByIdAndUpdate({ _id }, req.body, {
      new: true,
      runValidators: true,
    });
    if (client.length === 0) {
      return res.send({ error: "No client found!" });
    }
    res.send(client);
  } catch (e) {
    res.send({ error: e });
  }
});

//inactive Client

router.put("/api/inactive:id", async (req, res) => {
  console.log(req.body);
  const _id = req.params.id;

  const body = req.body;
  body.isActive = !body.isActive;
  console.log(body);

  try {
    const client = await Client.findByIdAndUpdate({ _id }, body, {
      new: true,
      runValidators: true,
    });
    console.log(client);
    if (client.length === 0) {
      return res.send({ error: "No client found!" });
    }
    res.send(client);
  } catch (e) {
    console.log(e);
    res.send({ error: e });
  }
});

//delete Client

router.delete("/api/client:id", async (req, res) => {
  const _id = req.params.id;

  try {
    const client = await Client.findByIdAndDelete({ _id });
    if (client.length === 0) {
      return res.send({ error: "No client found!" });
    }
    res.send(client);
  } catch (e) {
    res.send({ error: e });
  }
});

export default router;
