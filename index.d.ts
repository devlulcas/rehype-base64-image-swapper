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
export default function rehypeBase64ImageSwapper(options?: {
    src: (encodedImage: string) => Promise<string>;
} | undefined): (tree: Root) => Promise<void>;
export type Root = import('hast').Root;
export type Element = import('hast').Element;
