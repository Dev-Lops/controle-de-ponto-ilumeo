// next-seo.config.ts
import { DefaultSeoProps } from "next-seo";

const SEO: DefaultSeoProps = {
  title: "Ponto Ilumeo",
  description: "Aplicação incrível para controle de ponto.",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://www.seusite.com", // Substitua pelo domínio do seu site
    siteName: "Controle de Ponto Ilumeo",
    images: [
      {
        url: "https://www.seusite.com/imagem-principal.png", // URL de uma imagem representativa
        width: 1200,
        height: 630,
        alt: "Controle de Ponto Ilumeo",
      },
    ],
  },
  twitter: {
    handle: "@suaConta",
    site: "@suaConta",
    cardType: "summary_large_image",
  },
};

export default SEO;
