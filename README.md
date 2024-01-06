# Athena
A local-first web app for creating customizable content databases, suitable for note-taking, task-management, personal knowledge bases and more.

---

**This project is very early in development and is not complete or stable.**  
The about section below outlines the aspirational goal of this apps functionality, but is not currently the reality.  
Keep an eye on the releases and commits to see the current progress!

More documentation including usage instructions, development setup, more details will come closer to a `v1.0` release.

---

## About
The way each person wants to organise their content (such as notes, tasks etc) is unique, personal and often use-case specific.  
Athena gives you the building blocks to create your own content databases, in your own way. It is not just a "notes app"
or a "task management app", it is what you decide to build.  

The building blocks of Athena are "fields", "content types" and "views". You can learn more about these
below...

### Fields
Fields are the atoms that make up your content. There are different field types for different types of data, these are:
- Short Text
- Long Text (plain or markdown)
- Checkbox (boolean)
- Number
- Scale (number within a range)
- Options (select one from list of options)
- URL
- Date
- Timestamp
- Attachments (file/s of a configurable number and type)

Fields can be shared between different content types. This is useful when you wish to display content of multiple types
in the same view. For example, the board view requires both content types to have the same options field and the
calendar view requires both content types to have the same date field.

### Content Types
Content types are the level that you define your content structure. 
types may include things uch as "notes", "tasks", "bookmarks" and more.  
All content types have some built-in fields such as name, description, tags & timestamps, but you can then add custom fields
as required by your content structure.  
Here are some example content types:
- A "note" type may include the fields:
  - `body` - Long Text (markdown)
  - `status` - Options (draft, published, archived)
- A "task" type may include the fields:
  - `status` - Options (todo, in-progress, done)
  - `priority` - Options (low, medium, high)`
  - `due date` - Date
- A "journal" type may include the fields:
  - `date` - Date
  - `mood` - Scale (1 to 5)`
  - `health tracker` - Checkbox (with label "Have you done excessive and eaten well today?")
  - `body` - Long Text (markdown)
- A "bookmark" type may include the fields:
  - `url` - URL
  - `type` - Options (news, blog post, other)

### Views
Views let you create predefined "views" for your content.   
The exact functionality of a view depends on the view type, but at a high-level views let you filter content by content type and tags before displaying the results.  
The available view types are:
- List - Display a basic list of content, allowing for things like custom ordering.
- Board - Display content on a kanban board, with columns based on an options field.
- Calendar - Display content on a calendar using a date field.
- Table - Display a table with columns based on selected fields.
- Graph - Display a graph based on the values of selected fields.
- Canvas - Place content on an infinite canvas.
- Gallery - Display a gallery of images from an attachments field.

## Databases
Athena lets you create multiple databases, which are a self-contained collections of content. Each database has its own
content types, content etc.

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
