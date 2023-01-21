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
    // name: getRoomName(name),
    name: updatedName,
    description,
    createdBy,
    instructor,
    loading: false,
    disabled: isRoomDisabled(startDateTime, endDateTime),
    startDateTime,
    endDateTime,
    // dateStr,
    // timeStr,
    // date: date && JSON.parse(date),
    // time: time && JSON.parse(time),
  };
};

// export const getRoomName = (roomName) => {
//     const roomNameArr = roomName.split("_");
//     const str = roomNameArr.join(" ").slice(0, roomNameArr.length - 2);
//     return str.substring(0, str.lastIndexOf(" "));
// }

export const replaceAllfromString = (str, search, replace) => {
  while (str.includes(search)) {
    console.log("============= Updating Str ===============", str, search, replace);
    str.replace(search, replace);
  }
  return str;
};

const isRoomDisabled = (start, end) => moment().isBetween(start, end, 'm');

