import Head from "next/head";
import { MantineProvider } from "@mantine/core";
import { Global } from "@emotion/react";

export default function App(props) {
  const { Component, pageProps } = props;

  return (
    <>
      <Head>
        <title>AscFi</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>

      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          fontFamily: "Poppins, sans-serif",
          headings: { fontFamily: "Poppins, sans-serif" },
        }}
      >
        <Global
          styles={[
            `@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap");`,
          ]}
        />
        <Component {...pageProps} />
      </MantineProvider>
    </>
  );
}
