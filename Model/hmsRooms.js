const HmsRoomsModel = (sequelize, DataTypes) => {
  const HmsRooms = sequelize.define(
    "hms_rooms",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        required: true,
      },
      description: {
        type: DataTypes.STRING,
        required: false,
      },
      app_id: {
        type: DataTypes.STRING,
        required: true,
      },
      room_id: {
        type: DataTypes.STRING,
      },
      is_soft_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      instructor: {
        type: DataTypes.STRING,
        required: true,
      },
      product: {
        type: DataTypes.STRING,
        required: true,
      },
      enabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      start_date: {
        type: DataTypes.STRING,
        required: true,
      },
      end_date: {
        type: DataTypes.STRING,
        required: true,
      },
      start_time: {
        type: DataTypes.STRING,
        required: true,
      },
      end_time: {
        type: DataTypes.STRING,
        required: true,
      },
      last_updated_by: {
        type: DataTypes.STRING,
        required: true,
      },
      created_by: {
        type: DataTypes.STRING,
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
  return HmsRooms;
};

export default HmsRoomsModel;
