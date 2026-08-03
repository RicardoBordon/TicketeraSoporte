const autofillSx = {
  '& .MuiInputBase-input': {
    letterSpacing: '0.01rem',
    textAlign: 'center',
  },
  '& input:-webkit-autofill': {
    WebkitBoxShadow: '0 0 0 1000px white inset',
    WebkitTextFillColor: '#000',
    caretColor: '#000',
    transition: 'background-color 5000s ease-in-out 0s',
  },
  '& input:-webkit-autofill:hover': {
    WebkitBoxShadow: '0 0 0 1000px white inset',
  },
  '& input:-webkit-autofill:focus': {
    WebkitBoxShadow: '0 0 0 1000px white inset',
  },
};

export default autofillSx;
