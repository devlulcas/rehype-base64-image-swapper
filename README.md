# REHYPE BASE64 IMAGE SWAPPER

With this rehype plugin you can swap out base64 encoded images with any string you want.

A common use case is to extract the base64 encoded images from the HTML returned from a CMS and replace them with a placeholder image, a template tag or a CDN URL.
The plugin will also extract the base64 encoded images, so you can upload them to a CDN or save them to disk.

> Typescript support?
> Yes, this plugin is written in Javascript with JSDoc and the types are included.

## Installation

```bash
npm install @devlulcas/rehype-base64-image-swapper
```

### Usage

```js
import { rehype } from 'rehype';
import rehypeBase64ImageSwapper from '@devlulcas/rehype-base64-image-swapper';

const html = `
<div>
  <img
    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFUlEQVR42mP8z8BQz0AEYBxVSF+FABJADveWkH6oAAAAAElFTkSuQmCC"
    alt="red"
  />
  <img
    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFUlEQVR42mNk+M9Qz0AEYBxVSF+FAAhKDveksOjmAAAAAElFTkSuQmCC"
    alt="green"
  />
  <img
    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFUlEQVR42mNkYPhfz0AEYBxVSF+FAP5FDvcfRYWgAAAAAElFTkSuQmCC"
    alt="blue"
  />
  <img src="some-image.png" alt="non base64 image" />
</div>
`;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function replaceWithCDNPath(content) {
  const vFile = await rehype()
    .use(rehypeBase64ImageSwapper, {
      src: async (encodedImage) => {
        await sleep(1000);
        return `https://cdn.example.com/image.png`;
      },
    })
    .process(html);

  console.log(String(vFile));
}

replaceWithCDNPath(html);
```

### Options

| Option | Type                   | Description                                                                                                                                  |
| ------ | ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| src    | `string` or `function` | The string or function that will replace the base64 encoded image. The function will receive the base64 encoded image as the first argument. |

### Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

### Development

- Clone it

```bash
git clone https://github.com/devlulcas/rehype-base64-image-swapper
```

- Install dependencies

```bash
npm install
```

- Run tests

```bash
npm test
```

- Update the exported types

```bash
npm run tsc
```
