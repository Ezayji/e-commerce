import React from 'react';

import { render, screen } from '@testing-library/react';

import Loader from '../Loader';

describe('* <Loader /> *', () => {
    it('Renders without crashing', () => {
        render(<Loader />);

        expect(screen.getByAltText('Loader')).toBeInTheDocument();
    });
});