import postgresClientConnection from "../configurations/dbConnections/postgresConnection";

export const addUserToDb = async (email, userName, password, roles, name) => {
  try {
    yekolaLogger.info("Adding user to DB");
    const insertQuery = {
      text: "INSERT INTO public.users(email, name, password, roles, user_name) VALUES($1, $2, $3, $4, $5)",
      values: [email, name, password, roles, userName],
    };

    const result = await postgresClientConnection.query(insertQuery);
    yekolaLogger.info("Successfully added user to DB");
    return result.rows;
  } catch (e) {
    yekolaLogger.error(`Error while adding users in db: ${e.message}`);
    throw new Error(e);
  }
};

export const getUserDetailsFromDb = async (userName) => {
  try {
    yekolaLogger.info(`Fetching user details for user: ${userName} from DB`);
    const selectQuery = {
      text: "SELECT * FROM public.users WHERE user_name=$1",
      values: [userName],
    };

    const result = await postgresClientConnection.query(selectQuery);
    yekolaLogger.info(
      `Successfully fetched user: ${userName} from DB`,
      result.rows
    );
    return result.rows;
  } catch (e) {
    yekolaLogger.error(`Error while fetching user from db: ${e.message}`);
    throw new Error(e);
  }
};

export const fetchAllRolesFromDb = async () => {
  try {
    yekolaLogger.info(`Fetching all roles from DB`);
    const selectQuery = {
      text: "SELECT * FROM public.roles",
      values: [],
    };

    const result = await postgresClientConnection.query(selectQuery);
    yekolaLogger.info(`Successfully fetched all available roles from db`);
    return result.rows;
  } catch (e) {
    yekolaLogger.error(`Error while fetching user roles from db: ${e.message}`);
    throw new Error(e);
  }
};

export const fetchAllProductsFromDb = async () => {
  try {
    yekolaLogger.info(`Fetching all products from DB`);
    const selectQuery = {
      text: "SELECT * FROM public.products",
      values: [],
    };

    const result = await postgresClientConnection.query(selectQuery);
    yekolaLogger.info(`Successfully fetched all available products from db`);
    return result.rows;
  } catch (e) {
    yekolaLogger.error(`Error while fetching user roles from db: ${e.message}`);
    throw new Error(e);
  }
};

export const addRoomInformationToDb = async (
  name,
  description,
  roomId,
  appId,
  product,
  createdBy
) => {
  try {
    yekolaLogger.info(`FAdding room information to DB`);
    const insertDate = new Date();
    const selectQuery = {
      text: `INSERT INTO public.hms_rooms(name, description, room_id, app_id, product, created_by, last_updated_by, is_soft_deleted, enabled, last_updated, created_on) 
      VALUES($1, $2, $3, $4, $5, $6, $6, $7, $8, $9, $9) RETURNING *`,
      values: [
        name,
        description,
        roomId,
        appId,
        product,
        createdBy,
        false,
        true,
        insertDate,
      ],
    };

    const result = await postgresClientConnection.query(selectQuery);
    yekolaLogger.info(`Successfully added room information to DB`);
    return result.rows;
  } catch (e) {
    yekolaLogger.error(`Error while fetching user roles from db: ${e.message}`);
    throw new Error(e);
  }
};

export const listHmsRoomsFromDb = async (product) => {
  try {
    yekolaLogger.info(`Fetching room list from DB`);
    const insertDate = new Date();
    const selectQuery = {
      text: `SELECT id, room_id, name, description, created_by, instructor FROM public.hms_rooms WHERE product ILIKE $1 AND is_soft_deleted=false AND enabled=true ORDER BY last_updated DESC`,
      values: [product],
    };

    const result = await postgresClientConnection.query(selectQuery);
    yekolaLogger.info(`Successfully fetched list of rooms from DB`);
    return result.rows;
  } catch (e) {
    yekolaLogger.error(`Error while fetching user roles from db: ${e.message}`);
    throw new Error(e);
  }
};
