import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import connectToDatabase from '../../../lib/mongodb';
import User from '../../../models/User';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        try {
          console.log('Authorize called with:', credentials.email);
          
          await connectToDatabase();

          const user = await User.findOne({ email: credentials.email }).select('+password');
          
          if (!user) {
            console.log('No user found');
            return null;
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
          
          if (!isPasswordValid) {
            console.log('Invalid password');
            return null;
          }

          console.log('User authorized:', user._id.toString());
          
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name
          };
        } catch (error) {
          console.error('Authorization error:', error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, user, account, profile }) {
      console.log('JWT callback:', { user: !!user, account: !!account });
      
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        console.log('Token updated with user:', user.id);
      }
      
      return token;
    },
    async session({ session, token }) {
      console.log('Session callback:', { session: !!session, token: !!token });
      
      if (token && session.user) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        console.log('Session updated:', session.user.id);
      }
      
      return session;
    }
  },
  pages: {
    signIn: '/',
    error: '/'
  },
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: false // set to false for localhost
      }
    }
  }
};

export default NextAuth(authOptions);