import "@/styles/globals.css";
import { DefaultSeo } from "next-seo";
import type { AppProps } from "next/app";
import SEO from "../../next-seo.config";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { LoadingScreen } from "@/components/LoadingScreen";

export default function App({ Component, pageProps }: AppProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleRouteChangeStart = () => setIsLoading(true);
    const handleRouteChangeComplete = () => setIsLoading(false);
    const handleRouteChangeError = () => setIsLoading(false);

    router.events.on("routeChangeStart", handleRouteChangeStart);
    router.events.on("routeChangeComplete", handleRouteChangeComplete);
    router.events.on("routeChangeError", handleRouteChangeError);

    return () => {
      router.events.off("routeChangeStart", handleRouteChangeStart);
      router.events.off("routeChangeComplete", handleRouteChangeComplete);
      router.events.off("routeChangeError", handleRouteChangeError);
    };
  }, [router.events]);

  return (
    <>
      {/* Configuração de SEO global */}
      <DefaultSeo {...SEO} />

      {/* Tela de carregamento */}
      {isLoading && <LoadingScreen />}

      {/* Componente da página atual */}
      <Component {...pageProps} />
    </>
  );
}
