import React from 'react';
import { useRouter } from 'next/router';
import styled from '@emotion/styled';

import * as Yup from 'yup';
import { Formik } from 'formik';

import { spacing } from '@mui/system';
import MuiButton from '@mui/material/Button';
import MuiAlert from '@mui/material/Alert';
import MuiTextField from '@mui/material/TextField';

import useAuth from '../../hooks/useAuth';

const Alert = styled(MuiAlert)(spacing);

const TextField = styled(MuiTextField)<{ my?: number }>(spacing);

const Button = styled(MuiButton)(spacing);

function SignUp() {
  const router = useRouter();
  const { signUp } = useAuth();

  return (
    <Formik
      initialValues={{
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        submit: false
      }}
      validationSchema={Yup.object().shape({
        firstName: Yup.string().max(255).required('First name is required'),
        lastName: Yup.string().max(255).required('Last name is required'),
        email: Yup.string()
          .email('Must be a valid email')
          .max(255)
          .required('Email is required'),
        password: Yup.string()
          .min(8, 'Must be at least 8 characters')
          .max(255)
          .required('Required'),
        confirmPassword: Yup.string().when('password', {
          is: (val: any) => !!(val && val.length > 0),
          then: Yup.string().oneOf(
            [Yup.ref('password')],
            'Both password need to be the same'
          )
        })
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          await signUp(values.email, values.password);
          router.push('/auth/sign-in');
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
            <Alert mt={2} mb={1} severity="warning">
              {errors.submit}
            </Alert>
          )}
          <TextField
            type="text"
            name="firstName"
            label="First name"
            value={values.firstName}
            error={Boolean(touched.firstName && errors.firstName)}
            fullWidth
            helperText={touched.firstName && errors.firstName}
            onBlur={handleBlur}
            onChange={handleChange}
            my={3}
          />
          <TextField
            type="text"
            name="lastName"
            label="Last name"
            value={values.lastName}
            error={Boolean(touched.lastName && errors.lastName)}
            fullWidth
            helperText={touched.lastName && errors.lastName}
            onBlur={handleBlur}
            onChange={handleChange}
            my={3}
          />
          <TextField
            type="email"
            name="email"
            label="Email address"
            value={values.email}
            error={Boolean(touched.email && errors.email)}
            fullWidth
            helperText={touched.email && errors.email}
            onBlur={handleBlur}
            onChange={handleChange}
            my={3}
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
            my={3}
          />
          <TextField
            type="password"
            name="confirmPassword"
            label="Confirm password"
            value={values.confirmPassword}
            error={Boolean(touched.confirmPassword && errors.confirmPassword)}
            fullWidth
            helperText={touched.confirmPassword && errors.confirmPassword}
            onBlur={handleBlur}
            onChange={handleChange}
            my={3}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={isSubmitting}
            my={3}
          >
            Sign up
          </Button>
        </form>
      )}
    </Formik>
  );
}

export default SignUp;
