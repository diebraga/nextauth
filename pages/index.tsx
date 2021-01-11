import Head from 'next/head'
import { Button } from "@chakra-ui/react"
import { DarkModeSwitch } from '../components/DarkModeSwitch'
import { NextPage } from 'next'
import { signIn, signOut, useSession } from 'next-auth/client'

const Index: NextPage = () => {
  const [ session, loading ] = useSession()

  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <DarkModeSwitch />
      {!session && <>
        Not signed in <br/>
        <Button onClick={(): Promise<void> => signIn('auth0')}>Sign in</Button>
      </>}
      {session && <>
        Signed in as {session.user.email} <br/>
        <Button onClick={(): Promise<void> => signOut()}>Sign out</Button>
      </>}

    </div>
  )
}

export default Index
