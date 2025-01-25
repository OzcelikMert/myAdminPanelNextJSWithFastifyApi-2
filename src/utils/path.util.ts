const api = `${process.env.API_PROTOCOL}://${process.env.API_HOST}${process.env.API_PORT ? `:${process.env.API_PORT}` : ''}`;
const website = `${process.env.WEBSITE_PROTOCOL}://${process.env.WEBSITE_HOST}${process.env.WEBSITE_PORT ? `:${process.env.WEBSITE_PORT}` : ''}`;

const getApiURL = () => {
  return api;
};

const getWebsiteURL = (...paths: (number | string)[]) => {
  if(paths && paths.length >0){
    return createPath(website, ...paths).removeFirstChar();
  }
  return website;
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
  getWebsiteURL: getWebsiteURL,
  getImageURL: getImageURL,
  getFlagURL: getFlagURL,
  createPath: createPath,
};
