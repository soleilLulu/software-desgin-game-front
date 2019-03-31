import {API_PREFIX} from './_prefix.js';
const axios = require('axios');
// axios.defaults.withCredentials = true

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

/**
 * eqip方法
 *  */
export const characterEquip = (uuid) => {
    return axios.post(`${API_PREFIX}/game/equipment/${uuid}/equip`);
}

/**
 * 分解装备方法
 */
export const characterSplit = (uuid) => {
    return axios.post(`${API_PREFIX}/game/equipment/${uuid}/split`)
}

/**
 *  强化装备方法
 */
export const characterStrength = (uuid) => {
    return axios.post(`${API_PREFIX}/game/equipment/${uuid}/strength`)
}