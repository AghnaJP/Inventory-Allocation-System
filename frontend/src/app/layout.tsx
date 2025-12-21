import type { Metadata } from 'next';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '../lib/theme';
import Navbar from '../components/layout/Navbar';
import '../styles/globals.css';

export const metadata: Metadata = {
	title: 'Inventory Allocation System',
	description: 'Manage inventory and purchase requests',
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang='en'>
			<body>
				<AppRouterCacheProvider>
					<ThemeProvider theme={theme}>
						<CssBaseline />
						<Navbar />
						<main style={{ minHeight: 'calc(100vh - 64px)', padding: '24px' }}>
							{children}
						</main>
					</ThemeProvider>
				</AppRouterCacheProvider>
			</body>
		</html>
	);
}
