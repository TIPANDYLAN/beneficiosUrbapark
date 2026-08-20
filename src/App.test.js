import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

test('renders the benefits title and cedula form', () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );

  expect(screen.getByRole('heading', { name: /beneficios urbapark/i })).toBeInTheDocument();
  expect(screen.getByLabelText(/cedula/i)).toBeInTheDocument();
});
