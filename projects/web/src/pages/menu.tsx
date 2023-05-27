import React from 'react';
import {Helmet} from "react-helmet-async";
import {JButton, JButtonLink, JContentSection, JProse} from "@ben-ryder/jigsaw-react";
import {routes} from "../routes";
import {Link} from "react-router-dom";

/**
 * A page version of the main menu bar, used on mobile devices when space needs to be saved in the menu.
 *
 * @constructor
 */
export function MenuPage() {
  return (
    <>
      <Helmet>
        <title>Menu | Athena</title>
      </Helmet>


      <JContentSection>
        <JProse>
          <h2>Main Content</h2>
          <ul>
            <li><Link to={routes.content.notes.list}>Notes</Link></li>
            <li><Link to={routes.content.tasks.list}>Tasks</Link></li>
            <li><Link to={routes.content.journal.list}>Journal</Link></li>
          </ul>

          <h2>Management</h2>
          <ul>
            <li><Link to={routes.settings}>Settings</Link></li>
            <li><Link to={routes.organisation.tags.list}>Tags</Link></li>
          </ul>

          <h2>Other</h2>
          <ul>
            <li><Link to={routes.external.github}>Project GitHub</Link></li>
            <li><Link to={routes.external.docs}>Help & Documentation</Link></li>
            <li><Link to={routes.external.creator}>benryder.me</Link></li>
          </ul>
        </JProse>
      </JContentSection>
    </>
  );
}

