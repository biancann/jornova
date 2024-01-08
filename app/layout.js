import { Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata = {
  title: "Jornova",
  description: "Talk back with your journal &mdash; it listens, it responds",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={outfit.className + " bg-indigo-50"}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
