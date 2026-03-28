import "./globals.css";

export const metadata = {
  title: "DIVA 2.0 — Entretien diagnostique TDAH adulte",
  description: "Outil interactif basé sur l'entretien DIVA 2.0 pour le diagnostic du TDAH chez l'adulte.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
