export const config = {
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
    timeout: 5000,
  },
  auth: {
    tokenKey: 'token',
    redirectPath: '/pages/auth/login',
  },
  pagination: {
    defaultPageSize: 10,
  },
} as const;

export type Config = typeof config; 