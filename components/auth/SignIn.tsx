import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styled from '@emotion/styled';

import * as Yup from 'yup';
import { Formik } from 'formik';

import {
  Alert as MuiAlert,
  Button,
  Checkbox,
  FormControlLabel,
  TextField as MuiTextField
} from '@mui/material';
import { spacing } from '@mui/system';

import useAuth from '../../hooks/useAuth';

const Alert = styled(MuiAlert)(spacing);
const TextField = styled(MuiTextField)<{ my?: number }>(spacing);

function SignIn() {
  const router = useRouter();
  const { redirectURL } = router.query;
  const { signIn } = useAuth();

  return (
    <Formik
      initialValues={{
        email: 'user@website.com',
        password: 'password',
        submit: false
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string()
          .email('Must be a valid email')
          .max(255)
          .required('Email is required'),
        password: Yup.string().max(255).required('Password is required')
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          await signIn(values.email, values.password);

          if (!redirectURL) {
            router.push('/');
          } else {
            router.push(redirectURL as string);
          }
        } catch (error: any) {
          const message = error.detail || 'Something went wrong';

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
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={isSubmitting}
          >
            Sign in
          </Button>
          <Link href="/auth/reset-password" passHref>
            <Button fullWidth color="primary">
              Forgot password
            </Button>
          </Link>
        </form>
      )}
    </Formik>
  );
}

export default SignIn;
