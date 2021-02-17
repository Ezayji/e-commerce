export const getConfig = {
    withCredentials: true,
    credentials: 'include'
};

export const sendConfig = {
    withCredentials: true,
    credentials: 'include',
    headers: {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'}
};