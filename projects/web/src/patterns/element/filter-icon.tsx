import {Filter} from "lucide-react";
import {iconColorClassNames, iconSizes} from "@ben-ryder/jigsaw";


export function FilterIcon() {
  return (
    <div className="border-2 border-br-whiteGrey-50 rounded-full hover:border-br-whiteGrey-200 p-2">
      <Filter size={iconSizes.small} className={iconColorClassNames.secondary} />
    </div>
  )
}