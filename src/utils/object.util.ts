const getWithKey = <T = any>(object: any, key?: string): T | undefined => {
  let foundItem: any = undefined;

  if (typeof object === 'object' && key && key.length > 0) {
    foundItem = object;
    for (const name of key.split('.')) {
      if (typeof foundItem !== 'undefined') {
        foundItem = foundItem[name];
      } else {
        foundItem = undefined;
        break;
      }
    }
  }

  return foundItem;
};

export const ObjectUtil = {
  getWithKey: getWithKey,
};
