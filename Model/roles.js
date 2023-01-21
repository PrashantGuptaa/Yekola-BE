const RolesModel = (sequelize, DataTypes) => {
    const Roles = sequelize.define(
      "roles",
      {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
          },
        role: {
          type: DataTypes.STRING,
          required: true,
        },
        level: {
          type: DataTypes.STRING,
          required: false,
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
    return Roles;
  };
  
  export default RolesModel;
  