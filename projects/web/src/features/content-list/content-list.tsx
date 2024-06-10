import {useObservableQuery} from "@localful-athena/react/use-observable-query";
import {DATA_SCHEMA} from "../../state/athena-localful";
import {ErrorCallout} from "../../patterns/components/error-callout/error-callout";
import {useWorkspaceContext} from "../workspace/workspace-context";
import {ContentCard} from "../../patterns/components/content-card/content-card";
import {useLocalful} from "@localful-athena/react/use-localful";

export interface SearchProps {
    onOpen?: () => void
}

export function ContentList(props: SearchProps) {
    const {currentDatabase} = useLocalful<DATA_SCHEMA>()
    const { openTab } = useWorkspaceContext()

    const contentQuery = useObservableQuery(currentDatabase?.liveQuery({
        table: 'content',
        // index: {
        //     field: 'type',
        //     operation: 'includes',
        //     value: ['task-type-id', 'note-type-id']
        // },
        whereCursor: (localEntity, version) => {
            return true
        },
        whereData: (entityDto) => {
            return true
        },
        sort: (dtos) => {
            return dtos
        }
    }))

    if (contentQuery.status === 'loading') {
        return <p>Loading...</p>
    }
    if (contentQuery.status === 'error') {
        return <ErrorCallout errors={contentQuery.errors} />
    }

    return (
        <div>
            {contentQuery.data.length > 0
              ? (
                <ul>
                    {contentQuery.data.map(content => (
                      <ContentCard
                        key={content.id}
                        id={content.id}
                        name={content.data.name}
                        description={content.data.description}
                        onSelect={() => {
                            openTab({type: "content", contentId: content.id})
                            if (props.onOpen) {
                                props.onOpen()
                            }
                        }}
                      />
                    ))}
                </ul>
              )
              : (
                <p>Not Content Found</p>
              )
            }
        </div>
    )
}
