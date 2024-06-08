import axios from 'axios';

const API_URL = 'https://api.skilla.ru/mango/getList';
const TOKEN = 'testtoken';

export const fetchCalls = async (params: any) => {
    const response = await axios.post(API_URL, params, {
        headers: {
            Authorization: `Bearer ${TOKEN}`,
        },
    });
    return response.data;
};