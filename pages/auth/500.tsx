import React, { ReactElement } from 'react';
import Link from 'next/link';
import { Helmet } from 'react-helmet-async';
import styled from '@emotion/styled';

import MuiButton from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { spacing } from '@mui/system';

import AuthLayout from 'layouts/Auth';

const Button = styled(MuiButton)(spacing);

const Wrapper = styled.div`
  padding: ${(props) => props.theme.spacing(6)};
  text-align: center;
  background: transparent;

  ${(props) => props.theme.breakpoints.up('md')} {
    padding: ${(props) => props.theme.spacing(10)};
  }
`;

function Page500() {
  return (
    <Wrapper>
      <Helmet title="500 Error" />
      <Typography component="h1" variant="h1" align="center" gutterBottom>
        500
      </Typography>
      <Typography component="h2" variant="h5" align="center" gutterBottom>
        Internal server error.
      </Typography>
      <Typography component="h2" variant="body1" align="center" gutterBottom>
        The server encountered something unexpected that didn&apos;t allow it to
        complete the request.
      </Typography>

      <Link href="/" passHref>
        <Button variant="contained" color="secondary" mt={2}>
          Return to website
        </Button>
      </Link>
    </Wrapper>
  );
}

Page500.getLayout = function getLayout(page: ReactElement) {
  return <AuthLayout>{page}</AuthLayout>;
};

export default Page500;
