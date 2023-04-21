import { render } from '@testing-library/react';
import App from '~/App';

describe('App', () => {
  it('renders headline', () => {
    const { getByText } = render(<App />);

    expect(getByText('Open debug')).toBeInTheDocument();
  });
});
