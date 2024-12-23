declare global {
  namespace NodeJS {
    interface ProcessEnv {
      API_PROTOCOL: "http" | "https";
      API_HOST: string;
      API_PORT: string;
      RUN_TYPE: "dev" | "production";
      UPLOAD_FILE_SIZE: string;
    }
  }
}

export {};
