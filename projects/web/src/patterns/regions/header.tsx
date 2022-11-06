import React, {useEffect, useMemo, useState} from 'react';
import {AccountMenu} from "../components/account-menu";
import {routes} from "../../routes";
import {useApplication} from "../../helpers/application-context";
import {UserDto} from "@ben-ryder/lfb-common";


export function Header() {
  const [currentUser, setCurrentUser] = useState<UserDto|null>(null);
  const {application} = useApplication();

  // useEffect(() => {
  //   async function loadUser() {
  //     const user = await application.getCurrentUser();
  //     setCurrentUser(user);
  //   }
  // }, [application]);

  return (
    <header className="bg-br-atom-800 flex justify-between h-[56px]">
      <a href={routes.home} className="flex justify-center items-center ml-3">
        <i className="block w-7 h-7 rounded-full bg-br-teal-600"></i>
        <p className="ml-2 font-bold text-br-whiteGrey-100">Athena</p>
      </a>
      {currentUser && <AccountMenu user={currentUser} />}
    </header>
  );
}
