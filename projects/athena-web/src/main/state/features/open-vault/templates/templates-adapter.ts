import {createEntityAdapter} from "@reduxjs/toolkit";
import {Template} from "../open-vault-interfaces";


export const templatesAdapter = createEntityAdapter<Template>({
  selectId: (entity) => entity.id,
  sortComparer: (a, b) => a.name.localeCompare(b.name)
})
