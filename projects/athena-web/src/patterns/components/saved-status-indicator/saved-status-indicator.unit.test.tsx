import {SavedStatus} from "./saved-status-indicator";
import { composeStories } from "@storybook/testing-react";
import * as stories from "./saved-status-indicator.stories";

const { Default } = composeStories(stories);

const selector = "[data-cy-root] p"

describe('Prop Testing', () => {
  it('saved should display as expected', () => {
    cy.mount(<Default status={SavedStatus.SAVED} />)

    cy.get(selector).should("have.text", "All changes saved")
  })

  it('unsaved should display as expected', () => {
    cy.mount(<Default status={SavedStatus.UNSAVED} />)

    cy.get(selector).should("have.text", "Unsaved changes")
  })
})
