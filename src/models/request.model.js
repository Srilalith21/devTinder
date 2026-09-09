const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUser: { type: mongoose.Schema.Types.ObjectId, required: true },
    toUser: { type: mongoose.Schema.Types.ObjectId, required: true },
    status: {
      type: String,
      enum: {
        values: ["ignored", "intrested", "accepeted", "rejected"],
        message: "{VALUE} is not a valid status",
      },
    },
  },
  { timestamps: true },
);

const connectionRequestModel = mongoose.model(
  "connectionRequest",
  connectionRequestSchema,
);

connectionRequestSchema.pre("save", async function () {
  const request = this;
  const { fromUser, toUser } = request;
  // current person is sending the request to current person Edgecase handling
  if (request.fromUser.equals(request.toUser)) {
    throw new Error("cannot send request to yourself");
  }
});

module.exports = connectionRequestModel;
