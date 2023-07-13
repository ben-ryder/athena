# Command Bar

The command bar is central to the Athena app and provides a way to navigate the app and search for content.

## Commands

- `\ ` is used to start a command. A command takes priority over everything else, so if you were to submit `\cn #test` the `Create Note`
  command would run, not the search for `#test`.
- Available commands:
  - Go to:
    - `\n` - Go to notes
    - `\t` - Go to tasks
    - `\j` - Go to journal entries
    - `\r` - Go to reminders
    - `\t` - Go to tags
    - `\v` - Go to views
    - `\nt` - Go to note templates
    - `\jt` - Go to journal templates
  - Create:
    - `\cn` - Create note
    - `\ct` - Create task
    - `\cj` - Create journal entry
    - `\cr` - Create reminder
    - `\ct` - Create tag
    - `\cv` - Create view
    - `\cnt` - Create note template
    - `\cjt` - Create journal template

## Search & Filtering

- `#` can be used to filter by tags. Multiple tags can be included and will be combined using AND in the filter, so `#test #test3` = `#test AND #test3`.
- `@` can be used to filter by type, available types are `@n @t @j @r @nt @jt @t @v`. Types are combined using OR so `@n @j` becomes `note OR journal` content.
- `^` can be used to specify the order direction, available values are or `^asc`, `^desc`.
- `%` can be used to specify the field used to order the content, for example `%createdAt`, `%updatedAt`, `%name`.
- The default ordering shows the most recent items first, the corresponding default would be `%updatedAt ^desc`.
- Spaces can be included by wrapping content in `""`, for example `#"tag with space", $field~="some text"`.
- A normal search will default to a "like" comparison of the `name` field, so `#example test` is equivalent to `#example $name~test`.
- Advanced filtering can be achieved with the `$` symbol in the format `$field<opperator>value`:
  - Equality Checks:
    - `$field=value` checks the field exactly matches the value.
    - `$field~value` checks the field contains the value.
  - Comparison checks:
    - `$field>value` checks the field is greater than the value.
    - `$field<value` checks the field is less than the value.
    - `$field>=value` checks the field is greater than or equal to the value.
    - `$field<=value` checks the field is less than or equal to the value.
    - When filtering with dates, the format `YYYY-MM-DD` should be used.
    - When comparing string fields like `name` and `description` (for example `$name>=test`), the behaviour is simple [Javascript string comparison](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String#comparing_strings).
    - All comparisons are case-insensitive, so `$description~this` and `$descrption~This` are functionally identical and will match any capitalization of `this`, even something like `ThIS`.
  - Available fields, values and special behaviours:
    - `name` - all content types
    - `createdAt` - all content types
    - `updatedAt` - all content types
    - `description` - all content types
    - `body` - notes, note templates, journal entries and journal templates
    - `priority` - tasks only. values can be `neutral`, `low`, `medium` or `high`. comparisons work logically, for example `$priority>=medium` shows `medium` or `high` priority tasks
    - `status` - tasks only, values can be `todo`, `in-progress`, `done` or `removed`. comparisons work logically, for example `$status>=done` shows `done` or `removed` tasks

### Examples

Get all tasks with the `#project-one` tag that are not completed yet:

```
@t #project-one $status<completed
```

Get all tasks and notes with the `#example` and `#to-sort` tags, ordered by created date ascending:

```
@t @n #example #to-sort ^asc-createdAt
```

Get all journal entries in April 2023:

```
@j $createdAt~=2023-04
```

Get journal entries between 1st April 2023 and 14th April 2023 where the name contain the text "stand up":

```
@j $createdAt>=2023-04-02 $createdAt<=2023-04-14 $name~="stand up"
```
