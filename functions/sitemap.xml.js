export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const base = `${url.protocol}//${url.host}`;

  let displayLastmod = null;
  try {
    const res = await env.ASSETS.fetch(
      new Request(new URL("/display/display.json", base))
    );
    if (res.ok) {
      const data = await res.json();
      if (data && data.updated) displayLastmod = data.updated;
    }
  } catch (e) {
    // ignore
  }

  const routes = [
    { path: "/", priority: "1.0", changefreq: "daily" },
    { path: "/join/", priority: "0.8", changefreq: "monthly" },
    {
      path: "/display/",
      priority: "0.8",
      changefreq: "weekly",
      lastmod: displayLastmod,
    },
    { path: "/about/", priority: "0.6", changefreq: "monthly" },
  ];

  const body = routes
    .map((r) => {
      const lines = [`    <loc>${base}${r.path}</loc>`];
      if (r.lastmod) lines.push(`    <lastmod>${r.lastmod}</lastmod>`);
      lines.push(`    <changefreq>${r.changefreq}</changefreq>`);
      lines.push(`    <priority>${r.priority}</priority>`);
      return `  <url>\n${lines.join("\n")}\n  </url>`;
    })
    .join("\n");

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    `${body}\n` +
    `</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
