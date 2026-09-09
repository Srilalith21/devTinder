const express = require("express");
const { authenticateUser } = require("../middlewares/auth.middleware");
const ConnectionRequest = require("../models/request.model");
const { validateConnectionRequest } = require("../utils/validate");

const router = express.Router();

router.post("/send/:status/:toUserId", authenticateUser, async (req, res) => {
  /**
   * Edge cases:
   * The person can itself send the request to him/her self
   * CLIENT 1 ----> CLIENT 2 && CLIENT 2 ----> CLIENT 1
   */
  try {
    validateConnectionRequest(req);

    const status = req.params.status;
    const toUser = req.params.toUserId;
    const fromUser = req.USER_DATA._id;

    // check the person is already requested the same person before
    const isConnectionRequestSent = await ConnectionRequest.findOne({
      fromUser: fromUser,
      toUser: toUser,
    });
    if (isConnectionRequestSent) {
      throw new Error("connection request already sent");
    }

    // check wheather the current person is not receiving the request from the requested person
    const isConnectionConflict = await ConnectionRequest.findOne({
      $or: [
        { fromUser, toUser },
        { fromUser: toUser, toUser: fromUser },
      ],
    });
    if (isConnectionConflict) {
      throw new Error("connection request is already received");
    }
    console.log(isConnectionConflict);

    const requestData = new ConnectionRequest({
      fromUser,
      toUser,
      status,
    });

    const data = await requestData.save();

    res.send({
      message: `Connection request sent succesfuly`,
      data,
    });
  } catch (error) {
    res.status(400).send(`Request failed : ${error.message}`);
  }
});

// router.post("/review/:status/:requestId");

module.exports = router;
