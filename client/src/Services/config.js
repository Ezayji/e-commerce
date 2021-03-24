export const getConfig = {
    withCredentials: true,
    credentials: 'include'
};

export const sendConfig = {
    withCredentials: true,
    credentials: 'include',
    headers: {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'}
};

export const publicKey = 'pk_test_51IItmKB1uegguB7b2ReRKVdoa1Bojw5VxlWF9uuCwiYdY1Z3C8wpwI8kDau5SQ8qQN2nQdJXOvwvhODgssLH5RFn00LH75oIZw';