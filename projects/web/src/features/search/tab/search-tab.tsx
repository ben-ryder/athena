import {WithTabData} from "../../workspace/workspace";
import {Search} from "../search";

import "./search-tab.scss"

export interface SearchTabProps extends WithTabData {}

export function SearchTab() {
    return (
      <div className='search-tab'>
          <Search />
      </div>
    )
}
