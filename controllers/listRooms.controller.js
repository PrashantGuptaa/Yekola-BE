import { listHmsRoomsFromDb } from '../Model/yekola.db';

export const listRoomsController = async (req, res) => {
  try {
    const { product } = req.params;
    yekolaLogger.info(`Fetching all room where product is ${product} - controller`);
    const response = await listHmsRoomsFromDb(product);
    yekolaLogger.info("Successfully fetched rooms - controller");
    res.status(200).json(response);
  } catch (e) {
    yekolaLogger.error(e.message);
    res.status(500).json(e.message);
  }
};

