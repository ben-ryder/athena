import {ReactNode} from "react";

export interface MainPanelActionProps {
    text: string
    icon: ReactNode
    onSelect: () => void
}

export function MainPanelAction(props: MainPanelActionProps) {
    return (
        <div className="main-panel-action">
            <button className="main-panel-action__button" onClick={props.onSelect}>
                {props.icon}
                {props.text}
            </button>
        </div>
    )
}
