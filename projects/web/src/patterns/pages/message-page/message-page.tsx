import React, {ReactNode} from 'react';

export interface MessagePageProps {
  heading: string,
  text: ReactNode,
  extraContent?: ReactNode
}

export function MessagePage(props: MessagePageProps) {
    return (
      <div className="ath-message-page">
        <div className="ath-message-page__panel">
          <h1 className="ath-message-page__panel-heading">{props.heading}</h1>
          <div className="ath-message-page__panel-text">
            <div className="j-prose">
              <p>{props.text}</p>
            </div>
          </div>
          <div className="ath-message-page__panel-extra-content">
            {props.extraContent && props.extraContent}
          </div>
        </div>
      </div>
    );
}

