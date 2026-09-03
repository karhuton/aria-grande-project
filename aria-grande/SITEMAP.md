# Aria Grande sitemap

Aria Grande exposes a website's sitemap through:

```text
GET /ariag/sitemap
```

If the website already has a standard XML sitemap, the endpoint can return that
sitemap unchanged. This lets an AI-enabled browser discover the site's canonical
URLs without requiring the website to maintain a second sitemap format.

The endpoint may return either a Sitemap `<urlset>` or a Sitemap index. When it
returns an index, the referenced sitemap files may also contain Aria Grande
metadata.

## Optional Aria Grande metadata

A website can make its existing sitemap more useful to humans and AI-enabled
browsers by adding the Aria Grande namespace:

```xml
xmlns:ariag="https://aria-grande.dev/schemas/sitemap/1.0"
```

Aria Grande metadata is optional. Sitemap consumers that do not understand the
namespace can continue using the standard Sitemap fields.

Available metadata elements:

- `ariag:title`: Title for the page
- `ariag:description`: Description for the page
- `ariag:parent`: Absolute canonical URL of a parent resource. It may be repeated
  when a resource has multiple parents.

The schema is defined in
[`schemas/sitemap/1.0/aria-grande-sitemap.xsd`](schemas/sitemap/1.0/aria-grande-sitemap.xsd).

## Example

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:ariag="https://aria-grande.dev/schemas/sitemap/1.0">

  <url>
    <loc>https://northstar.example/collections/running</loc>
    <lastmod>2026-08-27</lastmod>
    <ariag:title>Running</ariag:title>
    <ariag:description>
      Running shoes for roads, trails, racing, and everyday training.
    </ariag:description>
  </url>

  <url>
    <loc>https://northstar.example/collections/road-running</loc>
    <lastmod>2026-08-27</lastmod>
    <ariag:title>Road running</ariag:title>
    <ariag:description>
      Shoes designed for training and racing on paved surfaces.
    </ariag:description>
    <ariag:parent>https://northstar.example/collections/running</ariag:parent>
  </url>

  <url>
    <loc>https://northstar.example/products/stride-nova-2</loc>
    <lastmod>2026-08-27</lastmod>
    <ariag:title>Stride Nova 2</ariag:title>
    <ariag:description>
      A cushioned daily road-running shoe available in standard and wide fits.
    </ariag:description>
    <ariag:parent>https://northstar.example/collections/road-running</ariag:parent>
  </url>

</urlset>
```

The standard `<loc>` remains the visitable destination. An AI-enabled browser
uses the title, description, and hierarchy to choose a page, then navigates to
its URL in the same way a human would.
