import Head from 'next/head'
import { DarkModeSwitch } from '../components/DarkModeSwitch'

export default function Home() {
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <DarkModeSwitch />
    </div>
  )
}
