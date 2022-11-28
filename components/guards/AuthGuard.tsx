import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import useAuth from '../../hooks/useAuth';

interface AuthGuardType {
  children: React.ReactNode;
}

// For routes that can only be accessed by authenticated users
function AuthGuard({ children }: AuthGuardType) {
  const { isAuthenticated, isInitialized } = useAuth();
  const [isRouting, setIsRouting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isInitialized && !isAuthenticated && !isRouting) {
      setIsRouting(true);
      router.push({
        pathname: '/auth/sign-in',
        query: { redirectURL: router.asPath } // Return to same page
      });
    }
  }, [isInitialized, isAuthenticated, router, isRouting]);

  return isInitialized && isAuthenticated ? <div>{children}</div> : <div />;
}

export default AuthGuard;
