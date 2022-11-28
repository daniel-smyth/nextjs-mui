import React, { ReactElement } from 'react';
import { Helmet } from 'react-helmet-async';
import styled from '@emotion/styled';

import { Paper, Typography } from '@mui/material';

import AuthLayout from 'layouts/Auth';

import SignInComponent from 'components/auth/SignIn';

const Wrapper = styled(Paper)`
  padding: ${(props) => props.theme.spacing(6)};

  ${(props) => props.theme.breakpoints.up('md')} {
    padding: ${(props) => props.theme.spacing(10)};
  }
`;

function SignIn() {
  return (
    <Wrapper>
      <Helmet title="Sign In" />

      <Typography component="h1" variant="h4" align="center" gutterBottom>
        Welcome
      </Typography>
      <Typography component="h2" variant="body1" align="center">
        Sign in to your account to continue
      </Typography>

      <SignInComponent />
    </Wrapper>
  );
}

SignIn.getLayout = function getLayout(page: ReactElement) {
  return <AuthLayout>{page}</AuthLayout>;
};

export default SignIn;
