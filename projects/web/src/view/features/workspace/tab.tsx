import classNames from "classnames";

export interface TabProps {
	name: string
	isActive?: boolean
	isUnsaved: boolean
	onSelect: () => void
	onClose: () => void
}

export function Tab(props: TabProps) {
	return (
		<div className={classNames('workspace-tab', {
			'workspace-tab--active': props.isActive
		})}>
			<button className='workspace-tab__select' onClick={() => {props.onSelect()}}>{props.name}</button>
			{props.isUnsaved && <span className='workspace-tab__save-status'><span className='j-hidden'>Unsaved</span></span>}
			<button className='workspace-tab__close' onClick={() => {props.onClose()}}>X</button>
		</div>
	)
}