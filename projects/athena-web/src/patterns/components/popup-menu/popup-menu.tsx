import classNames from "classnames";

export interface PopupMenuItem {
  label: string,
  action: () => void
}

export interface PopupMenuProps {
  label: string,
  visible: boolean,
  setVisible: (visible: boolean) => void
  items: PopupMenuItem[]
}

export function PopupMenu(props: PopupMenuProps) {
  return (
    <div className={classNames(
      "shadow-sm bg-br-atom-600 absolute mt-2",
      {
        "invisible": !props.visible
      }
    )}>
      {props.items.map(item =>
        <button
          key={item.label}
          onClick={() => {
            props.setVisible(false);
            item.action()
          }}
          className="whitespace-nowrap"
        >{item.label}</button>
      )}
    </div>
  )
}