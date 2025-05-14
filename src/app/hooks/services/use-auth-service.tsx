import { LoginRequest } from "@/models/auth";

export interface AuthService {
  login: (request: LoginRequest) => Promise<void>
}

export default function useAuthService(): AuthService {
  return {
    async login(request) {
      // TODO: add axios instance
      console.log(request);
    },
  }
}