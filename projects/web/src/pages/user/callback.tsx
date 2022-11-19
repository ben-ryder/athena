import {useHandleSignInCallback, useLogto} from '@logto/react';
import {useNavigate} from "react-router-dom";
import {routes} from "../../routes";

export function Callback() {
  const navigate = useNavigate();
  const {getIdTokenClaims} = useLogto();

  const { isLoading } = useHandleSignInCallback(async () => {

    const claims = await getIdTokenClaims();

    // Callback called when sign in is completed
    navigate(routes.home);
  });

  if (isLoading) {
    return <p>Login in progress, please wait...</p>;
  }

  return <p>Login completed, you should be redirected shortly...</p>
}
