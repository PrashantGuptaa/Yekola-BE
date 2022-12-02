import axios from "axios";

const commonHeaders = {
  "Content-Type": "application/json",
};
const HttpServices = {
  getRequest: async (url, headers) => {
    const result = await axios({
      method: "get",
      url,
      headers: {
        ...commonHeaders,
        ...headers,
      },
    });
    return result;
  },
  postRequest: async (url, data, headers) => {
    const result = await axios({
      method: "post",
      url,
      data,
      headers: {
        ...commonHeaders,
        ...headers,
      },
    });
    return result;
  },
  deleteRequest: async (url, data, headers) => {
    const result = await axios({
      method: "delete",
      url,
      data,
      headers: {
        ...commonHeaders,
        ...headers,
      },
    });
    return result;
  },
  patchRequest: async (url, data, headers) => {
    const result = await axios({
      method: "patch",
      url,
      data,
      headers: {
        ...commonHeaders,
        ...headers,
      },
    });
    return result;
  },
};

export default HttpServices;
