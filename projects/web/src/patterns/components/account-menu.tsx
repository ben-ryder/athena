import { Popover } from "@headlessui/react";
import {User as AccountIcon} from "lucide-react";
import React from "react";
import {routes} from "../../routes";
import {useApplication} from "../../helpers/application-context";
import {useLogto} from "@logto/react";
import { Float } from "@headlessui-float/react";


export function AccountMenu() {
  const {isAuthenticated} = useLogto();
  const {userDetails} = useApplication();
  const {signOut, signIn} = useLogto();

  return (
    <Popover className="h-full">
      <Float
        className="relative h-full"
        placement="top-start" offset={0} zIndex={30} flip={true}
        // Using https://headlessui-float.vercel.app/react/adaptive-width.html
        as="div"
        floatingAs={React.Fragment}
      >
        <Popover.Button
          className="w-full h-full flex justify-center items-center text-br-whiteGrey-100 hover:bg-br-atom-700 focus:bg-br-atom-700 focus:outline-none"
        >
          <div className="flex items-center border-2 rounded-[50%] mr-3">
            <AccountIcon size={20} />
          </div>
          <p className="font-bold">{userDetails?.name || "My Account"}</p>
        </Popover.Button>

        <Popover.Panel
          className="w-full shadow-t-md border-t border-br-blueGrey-700 text-br-whiteGrey-100"
        >
          {isAuthenticated &&
            <button
                className="block w-full p-2 text-center bg-br-atom-700 hover:bg-br-atom-600"
                onClick={() => signOut(window.location.origin)}
            >
                Sign Out
            </button>
          }
          {!isAuthenticated &&
            <button
                className="block w-full p-2 text-center bg-br-atom-700 hover:bg-br-atom-600"
                onClick={() => signIn(window.location.origin + routes.user.callback)}
            >
                Sign In
            </button>
          }
        </Popover.Panel>
      </Float>
    </Popover>
  )
}
