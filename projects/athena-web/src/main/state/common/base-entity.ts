export interface BaseEntity {
  // There are two id fields in preparation for automerge integration
  // Automerge sets and manages its own id fields, so I'm using uuid as an application level id to
  // reduce the risk of conflicts or library lock in.
  id: string,
  uuid: string
  createdAt: string,
  updatedAt: string,
}
