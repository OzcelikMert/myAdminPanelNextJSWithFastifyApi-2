declare global {
  namespace NodeJS {
    interface ProcessEnv {
      WEBSITE_PROTOCOL: 'http' | 'https';
      WEBSITE_HOST: string;
      WEBSITE_PORT: string;
      API_PROTOCOL: 'http' | 'https';
      API_HOST: string;
      API_PORT: string;
      RUN_TYPE: 'dev' | 'production';
      UPLOAD_FILE_SIZE: string;
    }
  }
}

export {};
