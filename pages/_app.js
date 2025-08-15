import { SessionProvider } from 'next-auth/react';
import { AuthProvider } from '../context/AuthContext';
import '../styles/globals.css';

export default function App({ 
  Component, 
  pageProps: { session, ...pageProps } 
}) {
  return (
    <SessionProvider session={session}>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </SessionProvider>
  );
}