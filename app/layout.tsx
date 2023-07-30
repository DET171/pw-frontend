import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'PW',
};

export default function RootLayout({
	children,
}: {
  children: React.ReactNode
}) {
	return (
		<html lang="en">
			<body className={`${inter.className} min-h-screen min-w-screen`}>
				{/* navbar */}
				<nav className='flex items-center justify-between flex-wrap bg-blue-500 p-6'>
					<div className='flex items-center flex-shrink-0 text-white mr-6'>
						<span className='font-semibold text-xl tracking-tight'>
							Spectre
						</span>
					</div>
				</nav>
				{children}
			</body>
		</html>
	);
}
