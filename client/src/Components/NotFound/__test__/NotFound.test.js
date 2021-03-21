import React from 'react';

import { render, screen } from '@testing-library/react';

import NotFound from '../NotFound';

describe('* <NotFound /> *', () => {
    it('Renders without crashing', () => {
        render(<NotFound />);

        expect(screen.getByText('Sorry, Page Not Found')).toBeInTheDocument();
    });
});