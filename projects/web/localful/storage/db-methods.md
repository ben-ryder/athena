
## Create
- accept data
- create entity id
- create version with encrypted data
- create entity with current version set
- read+write transaction on entity and versions:
    - add new entity
    - add new version

## Get
- If exists in cache, return
- read transaction on entity and versions:
    - load entity
    - if entity has current version, load that
    - if entity doesn't have current version, load all and find latest
- If no current version, set latest as current version and update entity
- Decrypt and combine entity & version data
- Update cache with latest value
- Return result

## Get All


## Update
- accept partial update of data
- Get current (using Get method)
- Combine update with current data and encrypt
- read+write transaction on entity and versions:
    - create new version with updated data
    - set entity current version as new version
- Update cache with updated data

## Delete
- read+write transaction on entity and versions:
    - delete all versions
    - set isDeleted flag on entity
- remove from cache

## Purge
- read+write transaction on entity and versions:
    - delete all versions
    - delete entity
- remove from cache