
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