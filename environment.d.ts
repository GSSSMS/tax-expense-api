declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      PORT?: string;
      SALT_ROUNDS: string;
      JWT_SECRET;
      COOKIE_NAME;
    }
  }
}

export {};
