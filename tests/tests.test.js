import fs from 'node:fs';
import { rehype } from 'rehype';
import { expect, test, vi } from 'vitest';
import rehypeBase64ImageSwapper from '../index.js';

test('error when given no options', () => {
  expect(() => rehypeBase64ImageSwapper()).toThrow(/options is required/);
});

test('error when given anything but a function to the src option property', () => {
  // @ts-ignore - we're testing for an error here
  expect(() => rehypeBase64ImageSwapper({ src: 'not a function' })).toThrow(
    /options.src is required/
  );
});

test('should ignore non-base64 encoded images', async () => {
  const srcFn = vi.fn();

  const html = fs
    .readFileSync('./tests/fixtures/non-base64-images.html')
    .toString();

  await rehype().use(rehypeBase64ImageSwapper, { src: srcFn }).process(html);

  expect(srcFn).toHaveBeenCalledOnce();
});

test('should replace three base64 encoded images with trem.png', async () => {
  const html = fs
    .readFileSync('./tests/fixtures/multiple-base64-images.html')
    .toString();

  const file = await rehype()
    .use(rehypeBase64ImageSwapper, {
      src: async () => 'trem.png',
    })
    .process(html);

  const processedHtml = String(file);

  console.log(processedHtml);

  const matchesCounter = (processedHtml.match(/trem\.png/g) || []).length;

  expect(matchesCounter).toBe(3);
});

test('should extract three base64 encoded images', async () => {
  const base64Images = [];

  const html = fs
    .readFileSync('./tests/fixtures/multiple-base64-images.html')
    .toString();

  await rehype()
    .use(rehypeBase64ImageSwapper, {
      src: async (encodedImage) => {
        base64Images.push(encodedImage);
        return 'trem.';
      },
    })
    .process(html);

  expect(base64Images.length).toBe(3);
});

test('should keep the current base64 encoded image if the promise fails', async () => {
  const html = fs
    .readFileSync('./tests/fixtures/multiple-base64-images.html')
    .toString();

  let keptAsIs = 1;

  const file = await rehype()
    .use(rehypeBase64ImageSwapper, {
      src: () => {
        if (keptAsIs < 2) {
          keptAsIs++;
          return Promise.reject('error');
        }

        return Promise.resolve('trem.png');
      },
    })
    .process(html);

  const processedHtml = String(file);
  console.log(processedHtml);

  const matchesCounter = (processedHtml.match(/trem\.png/g) || []).length;

  expect(matchesCounter).toBe(2);
});
