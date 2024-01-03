# Athena
A local-first web app for customisable note-taking, task-management, journaling, personal wikis and much more.

## About
**This project is very early in development and is not complete or stable.**  
The section below on "how it works" details the aspirational goal of this apps functionality, but
is not currently the reality.  
Keep an eye on the releases and commits to see the current progress!

More documentation including usage instructions, development setup, more details will come closer to a `v1.0` release.

## How it works
- Athena doesn't have the concept of "notes", "tasks" etc built in, instead everything you create is just a "content item".
- A content item has a name, tags, optional description and custom fields.
- Custom fields give you the flexibility to create any content you want, the types include:
  - Plain Text
  - Markdown
  - Boolean (checkbox)
  - Number
  - Scale (integer, 1 to set value)
  - Options (select one from list of strings)
  - URL
  - Date
  - Timestamp
- Views can be created to easily access & manage your content. Views let your filter and sort content, and "view modes" can be used to customise how the content is displayed.
- View modes include:
  - List - Display a basic list of content.
  - Kanban - Display a kanban board, with columns based on a custom options field.
  - Calendar - Display content in a calendar format, using a custom date field.
  - Graph - Display a graph based on the values of custom fields.
  - Canvas - Place content in an infinite canvas.
- By configuring a content item as a template, it's also possible to create content quickly and easily without having to create the same custom fields every time.
- Athena lets you create multiple vaults, which are completely separate collections of content.

### Need a note-taking system?
- Create template content with the "note" tag, and add a custom markdown field called "body".
- Create a view that only displays content with the "note" tag.
- You could add things like a custom "status" field with options like "Draft", "Published" and "Archived" to add a
  workflow to your notes, or add other tags and views to create different note types.

### Need a task-management system?
- Create template content with the "task" tag, and add custom fields for "status", "priority", "due date" etc as required.
- Create a view that only displays content with the "task" tag, then you could use the "kanban" view mode
  to display and manage tasks based on the custom "status" field you created.

### Need a journaling or daily/monthly note system?
- Create template content with the "journal" tag and a custom "date" field.
- Create a view for this content with the "calendar" view mode based on the custom date field.
- You could then add additional fields as required such as a markdown body, a scale field for mood tracking etc.

### Need something else?
Using tags, custom fields, views & view modes the possibilities for your content are endless! Here are a few other examples:
- Create a wiki for your next book by creating character, location, research and other types of content.
- Add a "read later" or "bookmarks" feature by creating content with a URL field. You could also add a "status" field to track what things you've still got left to read.
- Manage your ongoing projects using the kanban view mode and fields such as status, due date, etc.

## Cloud Features
Athena is a local-first web application meaning it's designed to work in your web browser and save data to your device
by default.  
By self-hosting your own [Localful](https://github.com/ben-ryder/localful) server, it's also possible to enable cross-device sync and cloud backups,
all while keeping your content encrypted.

## Project Structure
This is a monorepo containing all projects related to Athena:
- `web` - The web app for using Athena in a browser.
- `design` - Contains designs, wireframes etc

## Contributions
This project is open source, not open contribution.  
This is a personal project currently so while your more than welcome to try it out and raise bug reports and similar
I'm not interested in external code contributions or feature requests right now.

## License
All projects that are part of Athena are released under the [GNU AGPLv3](https://choosealicense.com/licenses/agpl-3.0/) license.
