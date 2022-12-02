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
      console.log(result.rows);
      yekolaLogger.info(`Successfully fetched user: ${userName} from DB`, result.rows);
      return result.rows;
    } catch (e) {
      yekolaLogger.error(`Error while fetching user from db: ${e.message}`);
      throw new Error(e);
    }
  };