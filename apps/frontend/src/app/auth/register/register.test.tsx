import { useToast } from '@chakra-ui/react';
import _authService from '@frontend/services/authService';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import RegisterPage from './page';

jest.mock('@frontend/services/authService');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));
jest.mock('@chakra-ui/react', () => {
  const originalModule = jest.requireActual('@chakra-ui/react');
  return {
    ...originalModule,
    useToast: jest.fn(),
  };
});

const authService = jest.mocked(_authService);

describe('RegisterPage', () => {
  const mockPush = jest.fn();
  const mockToast = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useToast as jest.Mock).mockReturnValue(mockToast);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly', () => {
    render(<RegisterPage />);
    expect(screen.getByPlaceholderText('First name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('last name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
  });

  test('submits form correctly', async () => {
    render(<RegisterPage />);

    fireEvent.change(screen.getByPlaceholderText('First name'), {
      target: { value: 'John' },
    });
    fireEvent.change(screen.getByPlaceholderText('last name'), {
      target: { value: 'Doe' },
    });
    fireEvent.change(screen.getByPlaceholderText('email'), {
      target: { value: 'john.doe@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' },
    });

    const button = screen.getByRole('button', { name: 'Register' });
    fireEvent.click(button);

    await waitFor(() => {
      expect(authService.register).toHaveBeenCalledWith({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      });
    });
  });

  test('handles form submission errors', () => {});
  test('toggles password visibility', () => {});
});
