import "../styles/globals.css";

import { AuthProvider, useAuth } from "../components/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { AnimatePresence } from "framer-motion";
import BottomNav from "../components/BottomNav";
import Head from "next/head";
import Navbar from "../components/Navbar";
import NewNavbar from "../components/NewNavbar";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";
import { themeChange } from "theme-change";
import { useEffect } from "react";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const queryClient = new QueryClient();

  useEffect(() => {
    themeChange(false);

    // check if localStorage has a theme
    if (localStorage.getItem("theme")) {
      document.body.setAttribute("data-theme", localStorage.getItem("theme"));
    } else {
      document.body.setAttribute("data-theme", "wicket-light");
    }
  }, []);

  return (
    <>
      <Head>
        <title>
          {router.pathname === "/"
            ? "wicket | Home"
            : router.pathname === "/me"
            ? "wicket | Me"
            : router.pathname === "/feed"
            ? "wicket | My Feed"
            : router.pathname === "/signin"
            ? "wicket | Sign in"
            : router.pathname === "/signup"
            ? "wicket | Sign up"
            : router.pathname === "/messages"
            ? "wicket | My Messages"
            : "wicket | Page not registered"}
        </title>

        <meta
          name="viewport"
          content="initial-scale=1.0, width=device-width"
          charSet="urf-8"
        />

        <link rel="icon" href="/newlogo.svg" />

        {/* link manifest */}
        <link rel="manifest" href="/manifest.json" />
      </Head>

      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <>
            {/* <Navbar /> */}
            <NewNavbar />

            <main className="flex justify-center bg-base-100">
              <section className="w-full max-w-5xl py-16 px-5 lg:px-0 min-h-screen">
                <AnimatePresence mode="wait">
                  <Component {...pageProps} key={router.pathname} />
                </AnimatePresence>
              </section>
            </main>

            {/* <BottomNav /> */}

            <Toaster
              position="top-left"
              toastOptions={{
                style: {
                  padding: "16px",
                  gap: "8px",
                },
              }}
            />
          </>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </AuthProvider>
    </>
  );
}

export default MyApp;
