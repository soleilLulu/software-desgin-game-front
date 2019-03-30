import {API_PREFIX} from './_prefix.js';
const axios = require('axios');

/** move方法 */
export const characterMove = () => {
    return axios.post(`${API_PREFIX}/game/move`);

}

/** create方法
 * HumanType: DOCTOR,SOLDIER,ASSASSIN
 */
export const characterCreate = (userId,humanType) => {
    return axios.post(`${API_PREFIX}/game/create?userId=${userId}&humanType=${humanType}`);
}

/**
 * attack方法
 */
export const characterAttack = (key) => {
    return axios.post(`${API_PREFIX}/game/attack?key=${key}`);
}