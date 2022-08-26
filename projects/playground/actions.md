
## Notes
- create note
  - data:
    - initial note object (title, body, tags, folder)
  - side effects:
    - add new note to open content list
    - switch active content to new note
- delete note
  - data:
    - note id
  - side effects:
    - remove from open content list if present
    - switch active content if currently active
- update note
  - data:
    - note partial to update

## Templates
Identical to notes

## Folders
- delete folder:
  - all folders within the folder should be deleted
  - all files within the folder should be deleted

## Task Lists
- delete task list:
  - all tasks within this list should also be deleted
