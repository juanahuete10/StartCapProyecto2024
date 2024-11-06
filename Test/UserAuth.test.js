import { render, screen, fireEvent } from '@testing-library/react';
import UserAuth from '../path/to/UserAuth'; // Asegúrate de ajustar la ruta
import { AuthProvider } from '../path/to/AuthContext'; // Ajusta la ruta de tu contexto
import { auth } from '../path/to/firebase'; // Ajusta la ruta de tu configuración de Firebase

jest.mock('../firebase/firebaseconfig', () => ({
    auth: {
        signInWithEmailAndPassword: jest.fn(),
        // Puedes agregar más métodos según tu lógica
    },
}));

describe('UserAuth Component Tests', () => {
    test('successful login', async () => {
        render(
            <AuthProvider>
                <UserAuth />
            </AuthProvider>
        );

        fireEvent.change(screen.getByLabelText(/email/i), {
            target: { value: 'test@example.com' },
        });
        fireEvent.change(screen.getByLabelText(/password/i), {
            target: { value: 'password123' },
        });

        fireEvent.click(screen.getByRole('button', { name: /login/i }));

        // Asumiendo que tienes lógica para manejar el inicio de sesión
        await waitFor(() => {
            expect(auth.signInWithEmailAndPassword).toHaveBeenCalledWith('test@example.com', 'password123');
        });
    });

    test('login fails with incorrect credentials', async () => {
        // Simula el fallo del inicio de sesión
        auth.signInWithEmailAndPassword.mockRejectedValueOnce(new Error('Incorrect credentials'));

        render(
            <AuthProvider>
                <UserAuth />
            </AuthProvider>
        );

        fireEvent.change(screen.getByLabelText(/email/i), {
            target: { value: 'wrong@example.com' },
        });
        fireEvent.change(screen.getByLabelText(/password/i), {
            target: { value: 'wrongpassword' },
        });

        fireEvent.click(screen.getByRole('button', { name: /login/i }));

        // Verifica que se muestre un mensaje de error
        const errorMessage = await screen.findByText(/incorrect credentials/i);
        expect(errorMessage).toBeInTheDocument();
    });


});
