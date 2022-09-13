import type { AppProps } from "next/app"
import { ChakraProvider } from "@chakra-ui/react"
import Head from "next/head"

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <Head>
        <title> We are the Champions </title>
        <link rel="icon" href="https://fav.farm/⚽" />
      </Head>
      <Component {...pageProps} />
    </ChakraProvider>
  )
}

export default MyApp
