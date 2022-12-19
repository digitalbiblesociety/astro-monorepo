import fs from "fs";
import path from "path";
import { JSDOM } from "jsdom";

const wp_url = import.meta.env.VITE_WORDPRESS_URL
let response = await fetch(`${wp_url}posts?_embed`);
const data = await response.json()

const posts = [];

for (const post of data) {
  const dom = new JSDOM(post.content.rendered);
  const { document } = dom.window;

  const getFilename = async (href, hostname) => {
    if (hostname !== "dbs.org" && hostname !== "localhost") {
      const filename = path.parse(href).base;

      if (!fs.existsSync(`public/images/${filename}`)) {
        const image = await (await fetch(href)).blob();
        const buffer = Buffer.from(await image.arrayBuffer());
        fs.writeFileSync(`public/images/${filename}`, buffer);
      }
      return `/images/${filename}`;
    }
  };

  const { href, hostname } = new URL(
    post._embedded["wp:featuredmedia"][0].source_url
  );
  const featuredImageFilename = await getFilename(href, hostname);
  post.featured_media_src_url = featuredImageFilename;

  for (const image of [...document.images]) {
    const { href, hostname } = new URL(image.src);
    const src = await getFilename(href, hostname);
    image.src = src ? src : image.src;

    const srcset = [];

    for (const src of image.srcset.split(" ")) {
      try {
        const { href, hostname } = new URL(src);
        const filename = await getFilename(href, hostname);
        srcset.push(filename ? filename : src);
      } catch (err) {
        srcset.push(src);
      }
    }

    image.srcset = srcset.join(" ");
  }

  post.content.rendered = document.body.innerHTML;
  posts.push(post);
}

export default posts
