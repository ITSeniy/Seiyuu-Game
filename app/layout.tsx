import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Игра про Сейю',
  description: 'Угадай, кого озвучивал сейю!',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}