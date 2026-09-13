async function getCurrentUserConnectionRequests(
  ConnectionRequest,
  loggedInUser,
) {
  const SAFE_DATA = "firstName lastName skills age gender";
  const userData = await ConnectionRequest.find({
    $or: [
      {
        fromUser: loggedInUser._id,
      },
      {
        toUser: loggedInUser._id,
      },
    ],
  }).select("fromUser toUser");

  const hideFromFeed = new Set();
  userData.forEach((item) => {
    hideFromFeed.add(item.fromUser._id.toString());
    hideFromFeed.add(item.toUser._id.toString());
  });

  return hideFromFeed;
}

module.exports = {
  getCurrentUserConnectionRequests,
};
