import axios from "axios";

const get = async (params: any, apiLink: string) => {
  const { data } = await axios.get<any>(apiLink, {
    params: params,
  });
  return data;
};

export default get;
