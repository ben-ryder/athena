import {ApplicationState} from "../../../state-interface";
import {createSelector} from "@reduxjs/toolkit";

export const selectTagsState = (state: ApplicationState) => state.openVault.tags;

export const selectTagOptions = createSelector([selectTagsState], (tags) => {
  return tags.ids
    .map(tagId => {
      return {
        name: tags.entities[tagId].name,
        value: tagId,
        backgroundColour: tags.entities[tagId].backgroundColour,
        textColour: tags.entities[tagId].textColour
      }
    })
    .sort((a, b) => a.name.localeCompare(b.name))
})