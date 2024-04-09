
export interface TabProps {
	name: string
	contentUnsaved: boolean
	onSelect: () => void
	onClose: () => void
}

export function Tab(props: TabProps) {
	return (
		<div>
			<button onClick={() => {props.onSelect()}}>{props.name}</button>
			<button onClick={() => {props.onClose()}}>close</button>
			{props.contentUnsaved && <p>UNSAVED!</p>}
		</div>
	)
}