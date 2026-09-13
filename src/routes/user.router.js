const express = require("express");
const { authenticateUser } = require("../middlewares/auth.middleware");
const ConnectionRequest = require("../models/request.model");
const User = require("../models/user.model");
const { getCurrentUserConnectionRequests } = require("../utils/getters");
const router = express.Router();

const SAFE_DATA = "firstName lastName skills age gender photoUrl";

// #TODO : 1
// router.get("/connections",authenticateUser,(req,res)=>{})

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

router.get("/feed", authenticateUser, async (req, res) => {
  try {
    /**
     * Constraints Do not show in feed
     *  1. Loggedin User
     *  2. Connection request sent by the user to others
     *  3. Ignored requestes
     *  4. Accepted requestes
     */

    const loggedInUser = req.USER_DATA;

    const hideFromFeed = await getCurrentUserConnectionRequests(
      ConnectionRequest,
      loggedInUser,
    );

    const feedData = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    }).select(SAFE_DATA);

    res.json({ message: "feed api route", data: feedData });
  } catch (error) {
    res.status(400).send({
      message: "feed API failed",
      error: error.message,
    });
  }
});

module.exports = router;
