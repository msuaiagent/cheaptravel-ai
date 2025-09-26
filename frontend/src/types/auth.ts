// Define types for authentication-related data structures
// The purpose of this is to have a centralized place for auth types
// This helps the TypeScript compiler catch type-related errors early
// so we don't mess up types in multiple places

export interface AuthUser {
  id: string
  email: string
  fullName?: string | null
  createdAt?: string
  emailConfirmed?: boolean
}

export interface SignUpRequest {
  email: string
  password: string
  fullName?: string
}

export interface SignInRequest {
  email: string
  password: string
}

export interface AuthResponse {
  message: string
  user?: AuthUser
  session?: {
    accessToken: string
    refreshToken: string
    expiresAt?: number
  }
}

export interface AuthError {
  error: string
}