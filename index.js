/**
 * TODO: Optimize this plugin by caching the images in a Map.
 */

import { visit } from 'unist-util-visit';

/**
 * @typedef {import('hast').Root} Root
 * @typedef {import('hast').Element} Element
 */

/**
 * Plugin to extract base64-encoded images from HTML. This is useful for e.g.
 * - uploading them to a CDN
 * - replacing them with a placeholder
 * - etc.
 *
 * @param {{src: (encodedImage: string) => Promise<string>}} [options]
 */
export default function rehypeBase64ImageSwapper(options) {
  if (typeof options === 'undefined') {
    throw new Error(
      'Error at rehype-base64-image-swapper: options is required! it should be an object with a src function and a mode string'
    );
  }

  if (typeof options.src !== 'function') {
    throw new Error(
      'Error at rehype-base64-image-swapper: options.src is required! it should be an async function that returns a string (the new src)'
    );
  }

  /**
   * @param {Root} tree
   */
  return async (tree) => {
    /** @type {Map<string, Map<string, number>>} */

    /**
     * List of images to extract.
     * @type {Promise<string>[]}
     */
    const promises = [];

    /**
     * Cache of images that have already been extracted.
     * @type {Map<string, string>}
     * */
    const cache = new Map();

    visit(tree, 'element', (node) => {
      if (!isBase64EncodedImageNode(node)) return;
      if (cache.has(node.properties.src)) return;

      // Push the promise to the list of promises so we can await them later
      promises.push(options.src(node.properties.src));
    });

    // Await all promises
    const awaitedPromises = await Promise.allSettled(promises);

    visit(tree, 'element', (node) => {
      if (!isBase64EncodedImageNode(node)) return;

      // If the image has already been extracted, set the new src and return
      const inCache = cache.get(node.properties.src);

      if (inCache) {
        node.properties.src = inCache;
        return;
      }

      // Get the new src from the array
      const newSrc = awaitedPromises.shift();

      if (!newSrc) {
        throw new Error(
          'Error at rehype-base64-image-swapper: how did this image get here? \n' +
            node.properties.src
        );
      }

      // Set the new src or keep the old one
      if (newSrc.status === 'fulfilled') {
        cache.set(node.properties.src, newSrc.value);
        node.properties.src = newSrc.value;
      }
    });
  };
}

/**
 * Type guard to check if a node has a base64-encoded image as its src.
 * @param {Element} node
 * @returns {node is Element & { properties: { src: string } }}
 */
function isBase64EncodedImageNode(node) {
  if (node.tagName !== 'img') return false;
  if (!node.properties.src) return false;
  if (typeof node.properties.src !== 'string') return false;
  if (!node.properties.src.startsWith('data:')) return false;
  return true;
}
