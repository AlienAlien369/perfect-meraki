import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "@/store/store";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import AdminLayout from "@/layout/AdminLayout";
import "@/styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isAdminRoute = router.pathname.startsWith("/admin");

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
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
      </PersistGate>
    </Provider>
  );
}
