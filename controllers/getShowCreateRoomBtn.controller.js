const getShowCreateRoomBtnController = async (req, res) => {
  yekolaLogger.info("Checking if user can create room");
  const { role } = req.user;
    console.log(req.user);
  if (role === "teacher" || role === "moderator") {
    return res.status(200).json({ createRoom: true });
  }

  res.status(200).json({ createRoom: false });
};

export default getShowCreateRoomBtnController;
