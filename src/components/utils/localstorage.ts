export enum Keys {
  TOKEN = 'auth/token',
  PRIVILEGES = 'auth/privileges',
  CUSTOMER = 'user/customerId'
}
const NOT_SUPPORTED_MESSAGE = 'Localstorage not supported';

/**
 * Set an item in localStorage
 * @param {string} key
 * @param {any} value
 */
export const lsSet = (key: string, value: any): void => {
  try {
    if (typeof value === 'string') {
      return localStorage.setItem(key, value);
    } else {
      return localStorage.setItem(key, JSON.stringify(value));
    }
  } catch (e) {
    console.log(NOT_SUPPORTED_MESSAGE);
  }
};

/**
 * Retrieve an item from localStorage
 * @param {string} key
 */
export const lsGet = (key: Keys) => {
  try {
    const value = localStorage.getItem(key);
    try {
      return (value && JSON.parse(value)) || null;
    } catch (e) {
      return value;
    }
  } catch (e) {
    console.log(NOT_SUPPORTED_MESSAGE);
  }
};

/**
 * Retrieve the user's API Token
 */
export const getToken = () => lsGet(Keys.TOKEN);

export const clearData = () => {
  lsSet(Keys.PRIVILEGES, null);
  lsSet(Keys.CUSTOMER, null);
  lsSet(Keys.TOKEN, null);
};
