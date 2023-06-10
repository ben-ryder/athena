import classNames from "classnames";
import {JArrowLink, JButton, JContentSection} from "@ben-ryder/jigsaw-react";
import {InternalLink} from "../../components/internal-link";
import {PropsWithChildren} from "../../../utils/children-prop";
import "./content-page.scss";

export function ContentPage(props: PropsWithChildren) {
  return (
    <JContentSection>
      <div className="ath-content-page">
        {props.children}
      </div>
    </JContentSection>
  )
}

export interface ContentPageMenuProps {
  backUrl: string,
  backText: string,
  onSave: () => void,
  onDelete?: () => void
}

export function ContentPageMenu(props: ContentPageMenuProps) {
  return (
    <div className="ath-content-page__menu">
      <JArrowLink as={InternalLink} direction="left" href={props.backUrl}>{props.backText}</JArrowLink>

      <div className="ath-content-page__actions">
        {props.onDelete &&
            <JButton
                variant="destructive"
                onClick={() => {
                  if (props.onDelete) {
                    props.onDelete();
                  }
                }}
            >Delete</JButton>
        }
        <JButton onClick={() => props.onSave()}>Save</JButton>
      </div>
    </div>
  )
}

export function ContentPageContent(props: PropsWithChildren) {
  return (
    <div className="ath-content-page__content">
      {props.children}
    </div>
  )
}

export interface ContentPageFieldProps extends PropsWithChildren {
  modifier?: string
}

export function ContentPageField(props: ContentPageFieldProps) {
  const className = classNames(
    "ath-content-page__field",
    {
      [`ath-content-page__field--${props.modifier}`]: !!props.modifier
    }
  )

  return (
    <div className={className}>
      {props.children}
    </div>
  )
}
