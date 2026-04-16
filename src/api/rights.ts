import api from '../lib/api';

export const setRights = async (rightsData: any) => {
  const response = await api.post('/rights', rightsData);
  return response.data;
};
