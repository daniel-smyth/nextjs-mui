import React, { useState } from 'react';
import styled from '@emotion/styled';
import Link from 'next/link';

import { spacing, SpacingProps } from '@mui/system';
import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import MuiButton, { ButtonProps } from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';

import LogInPopUp from 'components/auth/SignInPopUp';
import DanielSmythLogo from 'vendor/logo.svg';

const Button = styled(MuiButton)<
  SpacingProps & ButtonProps & { target?: string }
>(spacing);

const Logo = styled(DanielSmythLogo)`
  margin-right: ${(props) => props.theme.spacing(2)};
  margin-top: -2px;
  width: 150px;

  vertical-align: middle;
  display: inline;
`;

const LogoDiv = styled.div`
  font-size: ${(props) => props.theme.typography.h5.fontSize};
  font-weight: ${(props) => props.theme.typography.fontWeightMedium};
  font-family: ${(props) => props.theme.typography.fontFamily};
`;

const LogoComponent = React.forwardRef((props: any, ref: any) => (
  <a href={props.href} onClick={props.onClick} ref={ref}>
    <Logo style={{ cursor: 'pointer' }} />
  </a>
));

function NavBar() {
  const [loginOpen, setOpenLogin] = useState(false);

  const openLogIn = (value: boolean) => setOpenLogin(value);

  return (
    <AppBar position="relative" color="transparent" elevation={0}>
      <LogInPopUp isOpen={loginOpen} closeWindow={openLogIn} />

      <Toolbar>
        <Container>
          <Grid container alignItems="center">
            <Grid item>
              <LogoDiv>
                <Link href="/" passHref>
                  <LogoComponent />
                </Link>
              </LogoDiv>
            </Grid>
            <Grid item xs />
            <Grid item>
              <Button
                onClick={() => openLogIn(true)}
                ml={2}
                color="secondary"
                variant="contained"
              >
                Log In
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
