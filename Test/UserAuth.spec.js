import React from 'react';
import { render, screen } from '@testing-library/react';
import UserAuth from '../Test/UserAuth.test'; // Asegúrate de ajustar la ruta
import { AuthProvider } from '../path/to/AuthContext'; // Ajusta la ruta de tu contexto

describe('UserAuth Component', () => {
    test('renders the user authentication form', () => {
        render(
            <AuthProvider>
                <UserAuth />
            </AuthProvider>
        );

        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const submitButton = screen.getByRole('button', { name: /login/i });

        expect(emailInput).toBeInTheDocument();
        expect(passwordInput).toBeInTheDocument();
        expect(submitButton).toBeInTheDocument();
    });

  
});
