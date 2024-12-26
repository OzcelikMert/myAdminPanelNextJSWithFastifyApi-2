const api = `${process.env.API_PROTOCOL}://${process.env.API_HOST}${process.env.API_PORT ? `:${process.env.API_PORT}` : ''}`;

const getApiURL = () => {
  return api;
};

const getImageURL = (image?: string) => {
  return `${getApiURL()}/uploads/images/${image}`;
};

const getFlagURL = (flag?: string) => {
  return `${getApiURL()}/uploads/flags/${flag}`;
};

const createPath = (...paths: (number | string | undefined)[]) => {
  let returnPath = '';
  for (let path of paths) {
    if (path) {
      if (typeof path === 'string' && path.length > 0 && path.startsWith('/')) {
        path = path.slice(1);
      }

      returnPath += `/${path.toString()}`;
    }
  }
  return returnPath;
};

export const PathUtil = {
  getApiURL: getApiURL,
  getImageURL: getImageURL,
  getFlagURL: getFlagURL,
  createPath: createPath,
};
