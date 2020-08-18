# Dustin's Utilities Module

---

## Documentation for utilities

### Validation

#### Validation Options

| Name       | Purpose                                                              | Type       | Default |
| ---------- | -------------------------------------------------------------------- | ---------- | ------- |
| `strict`   | Requires the object to contain only items that constraints exist for | `boolean`  | `false` |
| `required` | Requires the object to contain at least the items in the array       | `string[]` | `[]`    |

#### Validation Constraints

| Name       | Purpose                                                   | Type                             | Default |
| ---------- | --------------------------------------------------------- | -------------------------------- | ------- |
| `email`    | Requires the specified value pass the email specfic regex | `boolean`                        | `false` |
| `number`   | Requires the value to be number only                      | `boolean`                        | `false` |
| `length`   | Requires the value to meet the min or max length          | `{ min?: number, max?: number }` | `null`  |
| `nullable` | Specifies if the value is allow to be unset or null       | `boolean`                        | `true`  |
| `allowed`  | List of strings or numbers that are allowed               | `(string| number)[]`             | `null`  |
| `casing`   | Desired casing to validate the item for                   | `string (any, upper, lower)`     | `null`  |
| `type`     | If specified a type the typeof will be compared           | `string`                         | `null`  |

---

### Logging

#### Traditional logging

Also bundled is a logging utility

This logging utility exposes the following methods

| Name    | Purpose                                                                                                                                                |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Log`   | `console.log` but with the twist of color,time and other logger benefits                                                                               |
| `Error` | `console.error` same as log with different colors, and registers as an error on our error tracking                                                     |
| `Debug` | `console.log` nearly the same as `Log` but with the twist of an env variable check for `DEBUG="dustin:*"` which will allow the output of this log line |

#### Request logging

• Request Method \
• Request Path \
• Status Code \
• Response Time in `ms` \
• Client IP Address \
• Response Size `B/KB/MB/GB`

---

### Request Responses

| Name      | Response Format                            | Parameters                                                |
| --------- | ------------------------------------------ | --------------------------------------------------------- |
| `Success` | `{ success: true, data }`                  | `res: Response, status: number, data?: any`               |
| `Failed`  | `{ error: true, code, data }`              | `res: Response, status: number, code: string, data?: any` |
| `Missing` | `{ error: true, code: 'route_not_found' }` | `res: Response`                                           |
| `Catch`   | `{ error: true, code: 'catch', data }`     | `res: Response, data?: any`                               |
