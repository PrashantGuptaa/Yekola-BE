import database from "./sequelize.js";

// export const getUserDetailsFromDb = async (userName) => {
//   try {
//     yekolaLogger.info(`Fetching user details for user: ${userName} from DB`);
//     const selectQuery = {
//       text: "select users.id as id, name, email, user_name, password, role, room_edit_allowed  FROM public.users left join roles on users.role_id =roles.id  WHERE user_name=$1",
//       values: [userName],
//     };

//     const result = await postgresClientConnection.query(selectQuery);
//     yekolaLogger.info(
//       `Successfully fetched user: ${userName} from DB`,
//       result.rows
//     );

//     return result.rows;
//   } catch (e) {
//     yekolaLogger.error(`Error while fetching user from db: ${e.message}`);
//     throw new Error(e);
//   }
// };


export const getUserDetailsFromDb = async (userName) => {
  try {
    yekolaLogger.info(`Fetching user details for user: ${userName} from DB`);
    const [result,] = await database.sequelize.query(`select users.id as id, name, email, user_name, password, role, room_edit_allowed  FROM users left join roles on users.role_id=roles.id  WHERE user_name="${userName}"`);

    return result;
  } catch (e) {
    yekolaLogger.error(`Error while fetching user from db: ${e.message}`);
    throw new Error(e);
  }
};



// export const updatePass