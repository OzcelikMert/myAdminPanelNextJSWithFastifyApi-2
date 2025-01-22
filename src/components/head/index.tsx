import React from 'react';
import Head from 'next/head';

type IComponentProps = {
  title: string;
  icon?: string;
};

const ComponentHead = React.memo((props: IComponentProps) => {
  return (
    <Head>
      <title>Admin Panel | {props.title || 'Loading...'}</title>
      <meta charSet="utf-8" />
      <link rel="shortcut icon" href="/images/ozcelikLogoMini.png" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="robots" content="noindex, nofollow" />
      <meta name="copyright" content="Özçelik Software" />
      <meta name="author" content="Özçelik Software" />
    </Head>
  );
});

export default ComponentHead;
