import {useObservableQuery} from "@localful-athena/react/use-observable-query";
import {localful} from "../../../../state/athena-localful";
import {ErrorCallout} from "../../../patterns/components/error-callout/error-callout";
import {useWorkspaceContext} from "../workspace-context";

export interface SearchProps {
    onOpen?: () => void
}

export function Search(props: SearchProps) {
    const { openTab } = useWorkspaceContext()

    const contentQuery = useObservableQuery(localful.db.observableQuery('content'))

    if (contentQuery.status === 'loading') {
        return <p>Loading...</p>
    }
    if (contentQuery.status === 'error') {
        return <ErrorCallout errors={contentQuery.errors} />
    }

    return (
        <div>
            <ul>
                {contentQuery.data.map(content => (
                    <li key={content.id}>
                        <h3>{content.data.name}</h3>
                        <p>Type: {content.data.type}</p>
                        <button onClick={() => {
                            openTab({type: "content", contentId: content.id})
                            if (props.onOpen) {
                                props.onOpen()
                            }}
                        }>Open</button>
                    </li>
                ))}
            </ul>
        </div>
    )
}
