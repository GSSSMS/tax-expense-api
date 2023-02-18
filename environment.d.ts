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

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export {};
