import NextAuth, { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'

// In-memory user store (replace with database in production)
const users: { id: string; email: string; name: string; password?: string; image?: string }[] = []

const authOptions: NextAuthOptions = {
  providers: [
    // Google OAuth
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    // Email/Password
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        name: { label: 'Name', type: 'text' },
        action: { label: 'Action', type: 'text' }, // 'login' or 'register'
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required')
        }

        const isRegister = credentials.action === 'register'

        if (isRegister) {
          // Check if user already exists
          const existingUser = users.find(u => u.email === credentials.email)
          if (existingUser) {
            throw new Error('User already exists')
          }

          // Create new user
          const hashedPassword = await bcrypt.hash(credentials.password, 10)
          const newUser = {
            id: `user_${Date.now()}`,
            email: credentials.email,
            name: credentials.name || credentials.email.split('@')[0],
            password: hashedPassword,
          }
          users.push(newUser)

          return {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
          }
        } else {
          // Login
          const user = users.find(u => u.email === credentials.email)
          if (!user || !user.password) {
            throw new Error('Invalid credentials')
          }

          const isValid = await bcrypt.compare(credentials.password, user.password)
          if (!isValid) {
            throw new Error('Invalid credentials')
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
          }
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id
      }
      return session
    },
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
