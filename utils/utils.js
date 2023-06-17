import  moment  from 'moment';

export const extractUsefulRoomInformation = (roomObj) => {
  console.log("F-4", roomObj);
  const {
    roomId,
    name,
    description,
     createdBy,
    instructor,
     startDateTime,
    endDateTime,
  } = roomObj;
  // let updatedName = name.slice(0, name.lastIndexOf("_"));
 const  updatedName = name.replace(/-/g, ' ');
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




