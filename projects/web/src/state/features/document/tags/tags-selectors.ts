import {createSelector} from "@reduxjs/toolkit";
import {ApplicationState} from "../../../store";

export const selectTagsState = (state: ApplicationState) => state.document.tags;

export const selectTagOptions = createSelector([selectTagsState], (tags) => {
  return tags.map(tag => {
    return {
      name: tag.name,
      value: tag.id,
      backgroundColour: tag.backgroundColour,
      textColour: tag.textColour
    }
  })
    .sort((a, b) => a.name.localeCompare(b.name))
})
