import  moment  from 'moment';

export const extractUsefulRoomInformation = (roomObj) => {
  const {
    room_id: roomId,
    name,
    description,
    created_by: createdBy,
    instructor,
    start_date_time: startDateTime,
    end_date_time:endDateTime,
  } = roomObj;
  let updatedName = name.slice(0, name.lastIndexOf("_"));
  updatedName = updatedName.replace(/_/g, ' ');
  return {
    roomId,
    name: updatedName,
    description,
    createdBy,
    instructor,
    loading: false,
    startDateTime,
    endDateTime,

  };
};




