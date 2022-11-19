import { Popover } from "@headlessui/react";
import {User as AccountIcon} from "lucide-react";
import React from "react";
import {routes} from "../../routes";
import {useApplication} from "../../helpers/application-context";
import {useLogto} from "@logto/react";


export function AccountMenu() {
  const {userDetails} = useApplication();
  const {signOut, signIn} = useLogto();

  return (
    <Popover className="h-full">
      <Popover.Button
        className="w-full h-full flex justify-center items-center text-br-whiteGrey-100 hover:bg-br-atom-700 focus:bg-br-atom-700 focus:outline-none"
      >
        <div className="flex items-center border-2 rounded-[50%] mr-3">
          <AccountIcon size={20} />
        </div>
        <p className="font-bold">{userDetails?.name || "My Account"}</p>
      </Popover.Button>

      <Popover.Panel
        className="absolute w-40 right-0 z-10 shadow-sm"
      >
        <nav className="text-br-whiteGrey-100 text-sm">
          <ul>
            <li>
              <button
                className="block w-full p-2 text-center bg-br-atom-600 hover:bg-br-atom-500"
                onClick={() => signOut(window.location.origin)}
              >
                Sign Out
              </button>
            </li>
            <li>
              <button
                className="block w-full p-2 text-center bg-br-atom-600 hover:bg-br-atom-500"
                onClick={() => signIn(window.location.origin + routes.user.callback)}
              >
                Sign In
              </button>
            </li>
          </ul>
        </nav>
      </Popover.Panel>
    </Popover>
  )
}
