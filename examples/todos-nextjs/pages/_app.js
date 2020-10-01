import 'styles/style.scss'
import Head from 'next/head'

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps}>
      <Head>
        <title>Supabase Todo Example</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

  </Component>
}

export default MyApp
