import { Popover } from "@headlessui/react";
import {User as AccountIcon} from "lucide-react";
import React from "react";
import {routes} from "../../routes";
import {useLFBApplication} from "../../helpers/lfb-context";
import { Float } from "@headlessui-float/react";
import {Link} from "@ben-ryder/jigsaw";
import {InternalLink} from "../../helpers/internal-link";


export function AccountMenu() {
  const {userDetails} = useLFBApplication();
  const isLoggedIn = false;

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
          {isLoggedIn
            ? (
              <Link
                as={InternalLink}
                className="block w-full p-2 text-center bg-br-atom-700 hover:bg-br-atom-600"
                href={routes.users.logout}
              >
                Sign Out
              </Link>
            )
            : (
              <Link
                as={InternalLink}
                className="block w-full p-2 text-center bg-br-atom-700 hover:bg-br-atom-600"
                href={routes.users.login}
              >
                Sign In
              </Link>
            )
          }
        </Popover.Panel>
      </Float>
    </Popover>
  )
}
