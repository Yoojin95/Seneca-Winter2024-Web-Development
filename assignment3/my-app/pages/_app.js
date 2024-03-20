import "@/styles/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Layout from "@/components/Layout";
import { SWRConfig } from "swr";

const fetcher = async (...args) => {
  const response = await fetch(...args);

  if (!response.ok) {
    throw new Error(`Request failed with status: ${response.status}`);
  }

  return response.json();
};

export default function App({ Component, pageProps }) {
  return (
    <Layout>
      <SWRConfig value={{ fetcher }}>
        <Component {...pageProps} />;
      </SWRConfig>
    </Layout>
  );
}
