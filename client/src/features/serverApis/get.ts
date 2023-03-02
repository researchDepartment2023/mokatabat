import axios from "axios";

const get = async (apiLink: string, params: any = {}) => {
  const { data } = await axios.get<any>(apiLink, {
    params,
  });
  return data;
};

export default get;
