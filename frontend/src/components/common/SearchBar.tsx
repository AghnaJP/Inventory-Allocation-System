'use client';

import { useState, useEffect, useRef } from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';

interface SearchBarProps {
	onSearch: (query: string) => void;
	placeholder?: string;
}

export default function SearchBar({
	onSearch,
	placeholder = 'Search...',
}: SearchBarProps) {
	const [query, setQuery] = useState('');
	const onSearchRef = useRef(onSearch);

	useEffect(() => {
		onSearchRef.current = onSearch;
	}, [onSearch]);

	useEffect(() => {
		const timer = setTimeout(() => {
			onSearchRef.current(query);
		}, 500);

		return () => clearTimeout(timer);
	}, [query]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setQuery(e.target.value);
	};

	return (
		<TextField
			fullWidth
			value={query}
			onChange={handleChange}
			placeholder={placeholder}
			InputProps={{
				startAdornment: (
					<InputAdornment position='start'>
						<SearchIcon />
					</InputAdornment>
				),
			}}
			sx={{ mb: 2 }}
		/>
	);
}
