export const fetchAllProductsController = async (req, res) => {
  try {
    yekolaLogger.info("Fetching all products - controller");
    // const response = await fetchAllProductsFromDb();
    yekolaLogger.info("Successfully all products - controller");
    res.status(200).json(response);
  } catch (e) {
    yekolaLogger.error(e.message);
    res.status(500).json(e.message);
  }
};
