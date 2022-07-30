import {UserDto} from "@ben-ryder/athena-js-lib";
import { Popover } from "@headlessui/react";
import {User as AccountIcon} from "lucide-react";
import React from "react";
import {routes} from "../../routes";

export interface AccountIndicatorProps {
  user: UserDto
}

export function AccountIndicator(props: AccountIndicatorProps) {
  return (
    <Popover>
      <Popover.Button
        className="flex text-br-whiteGrey-100 hover:bg-br-atom-900 focus:bg-br-atom-900 focus:outline-none p-4"
      >
        <p className="font-bold">{props.user.username}</p>
        <div className="flex items-center border-2 rounded-[50%] ml-2">
          <AccountIcon size={20} />
        </div>
      </Popover.Button>

      <Popover.Panel
        className="absolute w-40 right-0 z-10 shadow-sm"
      >
        <nav className="text-br-whiteGrey-100 text-sm">
          <ul>
            <li><a className="block w-full p-2 text-center bg-br-atom-600 hover:bg-br-atom-500" href={routes.users.settings}>Settings</a></li>
            <li><a className="block w-full p-2 text-center bg-br-atom-600 hover:bg-br-atom-500" href={routes.users.logout}>Log Out</a></li>
          </ul>
        </nav>
      </Popover.Panel>
    </Popover>
  )
}