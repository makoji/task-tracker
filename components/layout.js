import Head from 'next/head';
import Header from './header.js';


export default function Layout({ children, title = 'Task Master' }) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Simple and powerful task management application" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="app-container">
        <Header />
        <main>
          {children}
        </main>
      </div>
    </>
  );
}