import { IconButton, TextField, TextFieldProps } from '@mui/material';
import { forwardRef, useState } from 'react';

import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';

type PasswordTextFieldProps = TextFieldProps

const PasswordTextField = forwardRef<HTMLDivElement, PasswordTextFieldProps>(
  ({ ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const showPasswordClickHandle = () => {
      setShowPassword((prev) => !prev);
    };

    return (
      <TextField
        ref={ref}
        type={showPassword ? 'text' : 'password'}
        label="Password"
        {...props}
        fullWidth
        InputProps={{
          endAdornment: (
            <IconButton size="large" onClick={showPasswordClickHandle}>
              {showPassword ? <VisibilityOffIcon fontSize="large" /> : <VisibilityIcon fontSize="large" />}
            </IconButton>
          ),
          sx: { fontSize: '16px', borderRadius: '8px' },
        }}
        InputLabelProps={{
          sx: { fontSize: '16px' },
        }}
      />
    );
  },
);

export default PasswordTextField;
