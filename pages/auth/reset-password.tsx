import React, { ReactElement } from 'react';
import { Helmet } from 'react-helmet-async';
import styled from '@emotion/styled';

import { Paper, Typography } from '@mui/material';

import AuthLayout from 'layouts/Auth';

import ResetPasswordComponent from 'components/auth/ResetPassword';

const Wrapper = styled(Paper)`
  padding: ${(props) => props.theme.spacing(6)};

  ${(props) => props.theme.breakpoints.up('md')} {
    padding: ${(props) => props.theme.spacing(10)};
  }
`;

function ResetPassword() {
  return (
    <Wrapper>
      <Helmet title="Reset Password" />

      <Typography component="h1" variant="h4" align="center" gutterBottom>
        Reset Password
      </Typography>
      <Typography component="h2" variant="body1" align="center">
        Enter your email to reset your password
      </Typography>

      <ResetPasswordComponent />
    </Wrapper>
  );
}

ResetPassword.getLayout = function getLayout(page: ReactElement) {
  return <AuthLayout>{page}</AuthLayout>;
};

export default ResetPassword;
