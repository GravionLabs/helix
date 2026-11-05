# Open questions

Planning asks nothing; it lists the decisions it cannot resolve as `questions[]` in the plan. The caller puts them to the user.

## Which questions

- Only product, scope and risk choices. Anything the repo can answer, answer yourself (explore, do not ask).
- Questions are independent of each other: no question depends on another question's answer.
- Answers given in the prompt are final: keep those questions removed and plan accordingly.

## Fields

Every question carries all of these:

| Field         | Rule                                                                                |
| :------------ | :---------------------------------------------------------------------------------- |
| `id`          | `q1`, `q2`, … unique                                                                |
| `question`    | One decision, worded so "yes" accepts the recommendation                            |
| `options[]`   | At least 2 distinct choices                                                         |
| `recommended` | One of `options`                                                                    |
| `why`         | One or two sentences: the reason for the recommendation and the cost if it is wrong |

`blocks` lists the item ids that change with the answer (may be empty).
