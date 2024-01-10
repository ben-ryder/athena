

# Load Tag
- Load tag from `tags` table
- Load latest tag version from `tags_version` table

# Load Tags
- Load all tags from `tags` table
- For each tag, load latest version from `tags_versions` table

# Load Content
- Load content from `content` table
- Load latest content version from `content_versions` table
- Load fields
  - Load content type fields from `fields` table
  - Load latest field version from `fields_versions` table
  - Load latest content field from `content_fields_versions`

# Load View AND View Content
- Load view from `views` table
- Load latest view version from `views_versions` table
- Load all content from `content` table WHERE `contentTypeId` matches one of the types defined in the `view data`
- Load content:
  - Load latest content version from `content_versions`
  - Load content type fields from `fields` table WHERE `fieldId` matches a field to display/filter in the `view data`
  - Load latest field version from `fields_versions` table
  - Load latest content field from `content_fields_versions`
- Filter and sort the content given the criteria in the `view data`

# Save Entity
- Load entity from `entity` table
- Load latest entity version from `entity_versions` table