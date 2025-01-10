import "@/styles/globals.css";
import { DefaultSeo } from "next-seo";
import type { AppProps } from "next/app";
import SEO from "../../next-seo.config";

export default function App({ Component, pageProps }: AppProps) {
  <DefaultSeo {...SEO} />;
  return <Component {...pageProps} />;
}
