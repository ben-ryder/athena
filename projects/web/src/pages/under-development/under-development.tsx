import React from "react";
import { JButton, JProse } from "@ben-ryder/jigsaw-react";

import './under-development.scss'
import Image from "./undraw_developer_activity_re_39tg.svg"
import { routes } from "../../routes";

export function UnderDevelopmentPage() {
  return (
    <div className="dev-page">
      <div className="dev-page__icon">
       <img src={Image} alt="" />
      </div>
      <div className="dev-page__content">
        <h1 className="dev-page__title">Coming Soon</h1>
        <div  className="dev-page__text">
          <JProse>
            <p>Welcome to <strong>Athena</strong>, a local-first web app for creating customizable content databases, suitable for note-taking, task-management, personal knowledge bases and more. </p>
            <p>This project is currently in development, to learn more you can visit the <a href={routes.external.github}>GitHub Project</a>.</p>
            <p>You can start using Athena in its current state by clicking the button below, but as the project is still in development <b>expect breaking changes, incomplete functionality and bugs!</b></p>
          </JProse>
        </div>
        <div>
          <JButton onClick={() => {
            localStorage.setItem("athena", "true")
            window.location.reload()
          }}>Use Athena (VERY UNSTABLE)</JButton>
        </div>
      </div>
    </div>
  );
}
