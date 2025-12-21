'use client';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
	const pathname = usePathname();

	const navItems = [
		{ label: 'Dashboard', href: '/' },
		{ label: 'Stocks', href: '/stocks' },
		{ label: 'Purchase Requests', href: '/purchase-requests' },
	];

	return (
		<AppBar position='static'>
			<Toolbar>
				<Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
					Inventory System
				</Typography>
				<Box sx={{ display: 'flex', gap: 2 }}>
					{navItems.map((item) => (
						<Button
							key={item.href}
							color='inherit'
							component={Link}
							href={item.href}
							sx={{
								backgroundColor:
									pathname === item.href
										? 'rgba(255,255,255,0.1)'
										: 'transparent',
							}}>
							{item.label}
						</Button>
					))}
				</Box>
			</Toolbar>
		</AppBar>
	);
}
