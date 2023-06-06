import { render } from '@testing-library/react';
import App from '~/App';

describe('App', () => {
  it('renders headline', () => {
    const { getByTestId } = render(<App />);

    expect(getByTestId('cauldron')).toBeInTheDocument();
  });
});
