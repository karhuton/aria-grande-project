# Gov.example Aria Grande WebMCP

Example implementation of Aria Grande on Gov.example website.

## Actions

### Read `ariag-read`

No implementation: the client should access website content directly.

The website content is WGAG 2.0 accessible.

### Summarise `ariag-summarise`

Returns static summary text for each page.

Client fetches the summary with fetch("<page>.txt").

If a summary is not available, the tool returns null.

Example index.summary.txt:
```
This is the frontpage of gov.example.

You can browse the website by selecting a topic listed on this page.

Popular topics include: Benefits, Childcare and parenting, Citizenship, Driving and transport, Education and learning.

You can find information by searching or asking with AI.
```

Example benefits.summary.txt:
```
This is the Benefits page on gov.example.

All available benefits and related topics are listed on this page. Information includes eligibility, appeals, tax credits and Universal Credit.

You can browse benefits by selecting a topic.

You can find information by searching or asking with AI.
```

### Search `ariag-search`

Returns site search results with links as plain text.

Client fetches the results with fetch("/search?q=<query>").

Result template:
```
Search results for: <query>

N. <Title>
<Description>
<Link>
```

Example results for "care":
```
Search results for "care":

1. Benefits and financial support if you're caring for someone
Help if you regularly spend time caring for someone. Includes Universal Credit.
[https://.../browse/benefits.html]

2. Births, deaths, marriages and care
Parenting, civil partnerships, divorce and Lasting Power of Attorney
[https://.../browse/births-deaths-marriages.html]

(...)
```

No results:
```
No results found.
```

### Ask `ariag-ask`

Not implemented in live test site. When implemented, would return answers from AI model.

Example result for "how much is the parent leave benefit":
```
Your parental leave benefit amount depends on your personal income.

You can find a table of income levels and the parental leave benefit calculator on the page "Financial help if you have children":
[https://.../browse/child-care-parenting/financial-help-children.html]
```

### Frontpage `asiag-frontpage`

Returns frontpage link as static response:
```
[https://gob.example]
```

### Explore `asiag-navigate`

Returns a 2-part response: 1) navigation for current page and 2) navigation for frontpage.

Example benefits.nav.txt:
```
From Benefits
You can navigate forward to 7 main pages:
1. Manage an existing benefit, payment or claim
2. Benefits and financial support if you're looking for work
3. Benefits and financial support if you're temporarily unable to work
4. Benefits and financial support for families
5. Benefits and financial support if you're disabled or have a health condition
6. Benefits and financial support if you're caring for someone
7. Benefits and financial support if you're on a low income
```

Example index.nav.txt:
```
From frontpage
You can navigate forward to 10 main pages:
1. Benefits
2. Business and self-employed
3. Citizenship and living in the UK
4. Disabled people
5. Education and learning
6. Births, deaths, marriages and care
7. Childcare and parenting
8. Crime, justice and the law
9. Driving and transport
10. Employing people
```

### Login `ariag-login`

Returns static response:
```
The gov.example website does not include login or registration.
```
