const express = require("express");
const { authenticateUser } = require("../middlewares/auth.middleware");
const ConnectionRequest = require("../models/request.model");
const router = express.Router();

const SAFE_DATA = "firstName lastName skills age gender";

router.get("/requests/received", authenticateUser, async (req, res) => {
  try {
    const loggedInUser = req.USER_DATA;

    const data = await ConnectionRequest.find({
      $or: [
        { toUser: loggedInUser._id, status: "accepted" },
        { fromUser: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUser", SAFE_DATA)
      .populate("toUser", SAFE_DATA);

    const connections = data.map((user) => {
      if (loggedInUser._id.equals(user.fromUser._id)) {
        return user.toUser;
      } else {
        return user.fromUser;
      }
    });

    res.send({
      message: "fetched successfully",
      data: connections,
    });
  } catch (error) {
    res.status(400).send({
      message: `${error.message}`,
      status: "failed",
    });
  }
});

module.exports = router;
