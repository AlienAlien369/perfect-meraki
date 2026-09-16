import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "@/store/store";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { Fraunces, Inter } from "next/font/google";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import AdminLayout from "@/layout/AdminLayout";
import AuthBootstrap from "@/components/common/AuthBootstrap";
import RouteProgress from "@/components/common/RouteProgress";
import "@/styles/globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isAdminRoute = router.pathname.startsWith("/admin");

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthBootstrap />
        <RouteProgress />
        <div className={`${fraunces.variable} ${inter.variable}`}>
          {isAdminRoute ? (
            <AdminLayout>
              <Component {...pageProps} />
            </AdminLayout>
          ) : (
            <>
              <Navbar />
              <Component {...pageProps} />
              <Footer />
            </>
          )}
        </div>
      </PersistGate>
    </Provider>
  );
}
