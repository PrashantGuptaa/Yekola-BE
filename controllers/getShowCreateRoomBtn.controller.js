const getShowCreateRoomBtnController = async (req, res) => 
  res.status(200).json({ roomEditAllowed: true });


export default getShowCreateRoomBtnController;
