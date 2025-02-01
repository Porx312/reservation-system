export type UserRole = "client" | "admin"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
}

