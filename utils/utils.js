export const extractUsefulRoomInformation = (roomObj) => {
  const {
    id,
    room_id: roomId,
    name,
    description,
    created_by: createdBy,
    instructor,
    date_str,
    date,
    time_str,
    time,
    start_date: startDate,
    end_date:endDate,
    start_time:startTime,
    end_time:endTime,
  } = roomObj;
  const dateStr = date_str && JSON.parse(date_str);
  const timeStr = time_str && JSON.parse(time_str);
  return {
    roomId,
    // name: getRoomName(name),
    name: name.slice(0, name.indexOf("_")),
    description,
    createdBy,
    instructor,
    loading: false,
    disabled: isRoomDisabled(    startDate,
      endDate,
      startTime,
      endTime,),
    startDate,
    endDate,
    startTime,
    endTime,
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
    str.replace(search, replace);
  }
  return str;
};

const isRoomDisabled = (dateStr, timeStr) => {
const date = new Date();
console.log(date, dateStr, timeStr)
}
