// using npm modules thanks to ember-browserify
// not sure this is the way to deal with services in ember
import _ from 'npm:lodash';

export const retrieve = (key) => {
  try {
    const data = localStorage.getItem(key);
    return JSON.parse(data);
  } catch (e) {
    console.log(e);
    return undefined;
  }
};

// throttle to avoid writing at every key stroke
export const persist = _.throttle((key, input) => {
  try {
    const data = JSON.stringify(input);
    localStorage.setItem(key, data);
    return JSON.parse(data);
  } catch (e) {
    console.log(e);
  }
}, 100);
