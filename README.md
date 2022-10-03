![javascript](https://img.shields.io/static/v1?label=REHYPE&labelColor=000000&message=PLUGIN&color=fff635&logo=javascript&logoColor=f1ff00&style=flat-square)

# REHYPE BASE64 IMAGE SRC SWAPPER

> **Warning**: Work in progress

## USAGE

```js
import { unified } from "unified";
import rehypeParse from "rehype-parse";
import rehypeStringify from "rehype-stringify";
import rehypeBase64ImageExtractor from "./index.js";

const html = `
<p>AVIF</p>
<p>
  <img
    src="data:image/avif;base64,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"
  />
</p>
`;

const virtualFile = unified()
  .use(rehypeParse, { fragment: true })
  .use(rehypeBase64ImageExtractor, {
    handler: async ({ mimetype, content }) => {
      const response = await fetch("https://my.api.com/send", {
        method: "POST",
        body: JSON.stringify({ mimetype, content }),
      });

      const data = await response.json();

      // Ex: https://my.api.com/images/example.avif
      return data.resourceUrl;
    },
  })
  .use(rehypeStringify)
  .process(html);

// Tranformed HTML
virtualFile.then((newHtmlVirtualFile) => {
  console.log(String(newHtmlVirtualFile));
});
```

## ROADMAP

- [ ] Migrate to Typescript
- [ ] Add tests
- [ ] Publish in NPM
- [ ] Add documentation
