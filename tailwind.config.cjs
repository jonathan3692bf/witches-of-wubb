/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      backgroundImage: theme => ({
        'recipe-bg': "radial-gradient(circle at center, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 100%), url('public/images/script_bg.jpg')"
      }),
      colors: {
        'blue-400': 'hsl(180, 100%, 80%)',
      },
      keyframes: {
        fadein: {
          '0%': { opacity: '1' },
          '50%': { opacity: '0.7' },
          '100%': { opacity: '1' },
        },
        scale: {
          '0%': { transform: 'scale3d(0.4, 0.4, 1)' },
          '50%': { transform: 'scale3d(2.2, 2.2, 1)' },
          '100%': { transform: 'scale3d(0.4, 0.4, 1)' },
        },
      },
      animation: {
        fadein: 'fadein 200ms infinite',
        scale: 'scale 2s infinite',
      },
      transitionDuration: {
        '200': '200ms',
        '2000': '2000ms',
      },
    },
  },

  plugins: [
    require('@headlessui/tailwindcss')({ prefix: 'ui' }),
    function ({ addComponents }) {
      const newComponents = {
        'input[type="range"].custom-tempo-slider': {
          '@apply appearance-none': {},
          '&:focus': {
            '@apply outline-none': {},
          },
          '&::-webkit-slider-thumb': {
            '@apply appearance-none h-32 w-32 bg-center bg-no-repeat border-none scale-100': {},
            'background-image': "url('public/images/arcane_tempo_slider_120.png')",
          },
        },
        'input[type="range"].custom-volume-slider': { // Add new CSS class here
          '@apply appearance-none': {},
          '&:focus': {
            '@apply outline-none': {},
          },
          '&::-webkit-slider-thumb': {
            '@apply appearance-none h-32 w-32 bg-center bg-no-repeat border-none scale-100': {},
            'background-image': "url('public/images/arcance_volume_slider_120.png')", // Use new image URL here
          },
        },
      }
      addComponents(newComponents)
    },
  ],
};