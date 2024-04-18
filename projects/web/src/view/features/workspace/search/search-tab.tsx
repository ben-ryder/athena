import {WithTabData} from "../workspace";
import {Search} from "./search";

export interface SearchTabProps extends WithTabData {}

export function SearchTab() {
    return (
        <Search />
    )
}
