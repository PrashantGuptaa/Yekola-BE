const UsersModel = (sequelize, DataTypes) => {
  const Users = sequelize.define(
    "users",
    {
      name: {
        type: DataTypes.STRING,
        required: true,
      },
      email: {
        type: DataTypes.STRING,
        required: true,
      },
      password: {
        type: DataTypes.STRING,
        required: true,
      },
      role_id: {
        type: DataTypes.INTEGER,
        required: true,
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    { underscored: true }
  );
  return Users;
};

export default UsersModel;
