import React from 'react';

import { render, screen } from '@testing-library/react';

import Footer from '../Footer';

describe('* <Footer /> *', () => {
    it('Renders without crashing', () => {
        render(<Footer />);

        expect(screen.getByText('REVARZ™ 2021')).toBeInTheDocument();
        expect(screen.getByText('Powered by')).toBeInTheDocument();
        expect(screen.getByText('Ezayji')).toBeInTheDocument();

        expect(screen.getByAltText('Github')).toBeInTheDocument();
    });
});