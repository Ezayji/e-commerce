import React from 'react';

import { render, screen } from '@testing-library/react';

import Home from '../Home';

describe('* <Home /> *', () => {
    it('Renders without crashing', () => {
        render(<Home />);

        expect(screen.getByText('REVARZ')).toBeInTheDocument();
        expect(screen.getByText('THE FINEST STREETWEAR PLUG SINCE 2021')).toBeInTheDocument();
    });
});