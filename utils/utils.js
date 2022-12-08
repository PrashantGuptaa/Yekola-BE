import { permissionSetsPriority } from "../configurations/constants/permissions"

export const getHigestPermissionRoleAmongAll = (availableRoles) => {
    let bestRole = null, bestNumber = 0;
    availableRoles.forEach(role => {
        for (const [key, value] of Object.entries(permissionSetsPriority)) {
            if (permissionSetsPriority[role] > bestNumber) {
                bestNumber = value;
                bestRole = role;
            }
        }
    })
    return bestRole;
}

export const extractUsefulRoomInformation = (roomObj) => {
    const {
        id: roomId,
        name,
        description,
        created_by: createdBy,
        instructor
      } = roomObj;
      return {
        roomId,
        name: name.slice(0, name.indexOf("__")),
        description,
        createdBy,
        instructor,
        loading: false,
        disabled: false,
      };
}