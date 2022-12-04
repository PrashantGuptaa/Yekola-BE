import { fetchAllRolesFromDb } from '../Model/user.db';

export const fetchAllRolesController = async (req, res) => {
  try {
    yekolaLogger.info("Fetching all roles - controller");
    const response = await fetchAllRolesFromDb();
    yekolaLogger.info("Successfully all roles - controller");
    res.status(200).json(response);
  } catch (e) {
    yekolaLogger.error(e.message);
    res.status(500).json(e.message);
  }
};

