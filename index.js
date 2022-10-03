import { visit } from "unist-util-visit";
import { isElement } from "hast-util-is-element";

export default function rehypeBase64ImageExtractor({ handler }) {
  return async (tree) => {
    await visit(tree, "element", async (node, index, parent) => {
      // Ignore everything that is not an image
      if (
        typeof index !== "number" ||
        !isElement(node, "img") ||
        !node.properties ||
        !node.properties.src
      ) {
        return;
      }

      const src = String(node.properties.src);

      const findBase64 = /data:([^"]+)*/gm;

      const isBase64 = src.match(findBase64);

      if (isBase64 === null) return;

      const findBase64Mimetype = /data:(.*);base64/gi;

      const mimetypeWithWrapper = src.match(findBase64Mimetype)[0];

      const mimetype = mimetypeWithWrapper
        .replace("data:", "")
        .replace(";base64", "");

      const data = {
        mimetype: mimetype,
        content: src,
      };

      // Handler should return an url
      const url = await handler(data);

      // Changes the original img src
      const replacement = {
        ...node,
        properties: {
          ...node.properties,
          src: url,
        },
      };

      // replace the original img
      parent.children[index] = replacement;
    });
  };
}
