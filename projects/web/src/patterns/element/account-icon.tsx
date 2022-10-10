import {User as UserIcon} from "lucide-react";
import {iconColorClassNames, iconSizes} from "@ben-ryder/jigsaw";


export function AccountIcon() {
  return (
    <div className="border-2 border-br-whiteGrey-50 rounded-full hover:border-br-whiteGrey-200">
      <UserIcon size={iconSizes.small} className={iconColorClassNames.secondary} />
    </div>
  )
}