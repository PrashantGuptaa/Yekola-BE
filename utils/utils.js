export const extractUsefulRoomInformation = (roomObj) => {
    const {
        id,
        room_id: roomId,
        name,
        description,
        created_by: createdBy,
        instructor
      } = roomObj;
      return {
        roomId,
        // name: getRoomName(name),
        name: name.slice(0, name.indexOf("_")),
        description,
        createdBy,
        instructor,
        loading: false,
        disabled: false,
      };
}

// export const getRoomName = (roomName) => {
//     const roomNameArr = roomName.split("_");
//     const str = roomNameArr.join(" ").slice(0, roomNameArr.length - 2);
//     return str.substring(0, str.lastIndexOf(" "));
// }

export const replaceAllfromString = (str, search, replace) => {
    while (str.includes(search)) {
        str.replace(search, replace)
    }
    return str;
}