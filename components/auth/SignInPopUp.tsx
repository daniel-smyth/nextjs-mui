import * as React from 'react';
import styled from '@emotion/styled';

import * as Yup from 'yup';
import { Formik, Field } from 'formik';

import { spacing } from '@mui/system';
import CircularProgress from '@mui/material/CircularProgress';
import CloseIcon from '@mui/icons-material/Close';
import Collapse from '@mui/material/Collapse';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import MuiAlert from '@mui/material/Alert';
import MuiButton from '@mui/material/Button';
import MuiTextField from '@mui/material/TextField';

import useAuth from 'hooks/useAuth';

const devEnviroment = process.env.NODE_ENV !== 'production';

const Button = styled(MuiButton)`
  margin-top: 10px;
  min-height: 50px;
`;

const Alert = styled(MuiAlert)(spacing);

const TextField = styled(MuiTextField)<{ my?: number }>(spacing);

interface ResetPasswordProps {
  closeWindow: (value: boolean) => void;
}

const EMAIL_ERROR = 'Must be a valid email';
const EMAIL_REQUIRED = 'Email is required';

function ResetPassword({ closeWindow }: ResetPasswordProps) {
  const { resetPassword } = useAuth();
  const [success, setSuccess] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const inputErrors = Yup.object().shape({
    email: Yup.string().email(EMAIL_ERROR).max(255).required(EMAIL_REQUIRED)
  });

  const goBack = () => {
    closeWindow(false);
  };

  const submit = (values: { email: string; submit: boolean }) => {
    const bodyFormData = new FormData();
    bodyFormData.append('email', values.email);

    setLoading(true);

    resetPassword(values.email);

    setSuccess(true);
    setLoading(false);
  };

  return (
    <Formik
      initialValues={{ email: '', submit: false }}
      validationSchema={inputErrors}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          submit(values);
        } catch (error: any) {
          const message = error.message || 'Something went wrong';

          setStatus({ success: false });
          setErrors({ submit: message });
          setSubmitting(false);
        }
      }}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        touched,
        values
      }) => (
        <form noValidate onSubmit={handleSubmit}>
          {errors.submit && (
            <Alert mt={2} mb={3} severity="warning">
              {errors.submit}
            </Alert>
          )}
          <Collapse in={success}>
            <Alert
              mt={2}
              mb={3}
              severity="success"
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setSuccess(false);
                  }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
            >
              <strong>Success</strong> - check your inbox
            </Alert>
          </Collapse>
          <TextField
            type="email"
            name="email"
            label="Email Address"
            value={values.email}
            error={Boolean(touched.email && errors.email)}
            fullWidth
            helperText={touched.email && errors.email}
            onBlur={handleBlur}
            onChange={handleChange}
            my={2}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="secondary"
            disabled={isSubmitting}
          >
            {loading ? (
              <CircularProgress style={{ padding: '5px' }} color="inherit" />
            ) : (
              <>Email Reset Link</>
            )}
          </Button>
          <Button onClick={() => goBack()} fullWidth color="secondary">
            Go Back
          </Button>
        </form>
      )}
    </Formik>
  );
}

const logInInitalValues = {
  email: '',
  password: '',
  submit: false,
  remember: false
};

const PASSWORD_REQUIRED = 'Password is required';

interface LogInProps {
  isOpen: boolean;
  closeWindow: (value: boolean) => void;
}

export default function LogIn({ isOpen, closeWindow }: LogInProps) {
  const { signIn } = useAuth();
  const [showReset, setShowReset] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const inputErrors = Yup.object().shape({
    email: Yup.string().email(EMAIL_ERROR).max(255).required(EMAIL_REQUIRED),
    password: Yup.string().max(255).required(PASSWORD_REQUIRED)
  });

  const closeMe = () => closeWindow(false);

  const openResetPassword = (value: boolean) => setShowReset(value);

  const submit = async (values: { email: string; password: string }) => {
    setLoading(true);

    await signIn(values.email, values.password);

    window.parent.location.replace(
      devEnviroment
        ? process.env.NEXT_PUBLIC_API_URL_DEVELOPMENT!
        : window.parent.location.origin
    );

    setLoading(false);
  };

  return (
    <div>
      <Dialog fullWidth={false} maxWidth="xs" open={isOpen} onClose={closeMe}>
        <DialogTitle>{!showReset ? 'Log In' : 'Reset Password'}</DialogTitle>
        <DialogContent>
          {showReset && <ResetPassword closeWindow={openResetPassword} />}
          {!showReset && (
            <Formik
              initialValues={logInInitalValues}
              validationSchema={inputErrors}
              onSubmit={async (
                values,
                { setErrors, setStatus, setSubmitting }
              ) => {
                try {
                  await submit(values);
                } catch (error: any) {
                  const message = error.message || 'Something went wrong';

                  setStatus({ success: false });
                  setErrors({ submit: message });
                  setSubmitting(false);
                }
              }}
            >
              {({
                errors,
                handleBlur,
                handleChange,
                handleSubmit,
                isSubmitting,
                touched,
                values
              }) => (
                <form noValidate onSubmit={handleSubmit}>
                  {errors.submit && (
                    <Alert mt={2} mb={3} severity="warning">
                      {errors.submit}
                    </Alert>
                  )}
                  <TextField
                    type="email"
                    name="email"
                    label="Email Address"
                    value={values.email}
                    error={Boolean(touched.email && errors.email)}
                    fullWidth
                    helperText={touched.email && errors.email}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    my={2}
                  />
                  <TextField
                    type="password"
                    name="password"
                    label="Password"
                    value={values.password}
                    error={Boolean(touched.password && errors.password)}
                    fullWidth
                    helperText={touched.password && errors.password}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    my={2}
                  />
                  <FormControlLabel
                    control={
                      <Field
                        style={{ marginLeft: '20px' }}
                        type="checkbox"
                        name="toggle"
                      />
                    }
                    label="Remember me"
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="secondary"
                    disabled={isSubmitting}
                  >
                    {loading ? (
                      <CircularProgress
                        style={{ padding: '5px' }}
                        color="inherit"
                      />
                    ) : (
                      <>Log In</>
                    )}
                  </Button>
                  <Button
                    onClick={() => setShowReset(true)}
                    fullWidth
                    color="secondary"
                  >
                    Forgot password
                  </Button>
                </form>
              )}
            </Formik>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
