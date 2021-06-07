import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';
import fireEvent from '@testing-library/user-event'

test('renders proper title text', () => {
	render(<App />);
	const textElement = screen.getByText(/Log in to/i);
	expect(textElement).toBeInTheDocument();
})
test('renders proper info text', () => {
	render(<App />);
	const textElementOne = screen.getByText(/Your contacts will be synced using the HubSpot data from this user’s permissions./i);
	const textElementTwo = screen.getByText(/For more information read our/i);
	expect(textElementOne).toBeInTheDocument();
	expect(textElementTwo).toBeInTheDocument();
})
test('renders learn HubSpot QuickGuide Link', () => {
	render(<App />);
	const linkElement = screen.getByText(/HubSpot Quickstart Guide./i);
	expect(linkElement).toBeInTheDocument();
})
test('renders Login Button', () => {
	render(<App />);
	expect(screen.getByRole('button')).not.toBeDisabled()
	expect(screen.getByRole('button')).toBeInTheDocument();
})
