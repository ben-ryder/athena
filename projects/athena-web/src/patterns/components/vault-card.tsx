import {Link} from "../element/link";
import {linkWithParam, routes} from "../../routes";
import React from "react";
import {VaultDto} from "@ben-ryder/athena-js-lib";

export interface VaultCardProps {
  vault: VaultDto
}

export function VaultCard(props: VaultCardProps) {
  return (
    <li className="my-4 p-5 bg-br-atom-600 shadow-sm flex justify-between items-center">
      <div>
        <h2 className="font-bold text-br-whiteGrey-100 text-xl">{props.vault.name}</h2>
        {props.vault.description &&
          <p className="text-br-whiteGrey-100">{props.vault.description}</p>
        }
      </div>

      <div className="flex items-center justify-center">
        <Link
          className="text-br-whiteGrey-100 underline hover:text-br-teal-600"
          href={linkWithParam(routes.vaults.edit, props.vault.id)}
        >Edit Vault</Link>
        <Link
          className="ml-4 font-bold text-br-whiteGrey-100 underline hover:text-br-teal-600"
          href={linkWithParam(routes.app.main, props.vault.id)}
        >Open Vault</Link>
      </div>
    </li>
  )
}