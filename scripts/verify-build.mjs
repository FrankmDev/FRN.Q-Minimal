import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative, resolve } from "node:path";
import { siteConfig } from "../src/data/site.ts";
import { pricingGroups, lineAmount, lineBilling } from "../src/data/pricing.ts";
import { supportPrice } from "../src/data/support.ts";
import { solutionPages, solutionContactTypes } from "../src/data/solutions.ts";

// Parse generated HTML without a browser, network, or added dependencies.
const root = process.argv[2] ? resolve(process.argv[2]) : new URL("../dist/", import.meta.url).pathname;
const failures = [];
const check = (ok, message) => { if (!ok) failures.push(message); };
const normalize = (value = "") => value.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#(?:39|x27);/g, "'").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();

async function files(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map((entry) => entry.isDirectory() ? files(join(directory, entry.name)) : join(directory, entry.name)))).flat();
}

const htmlFiles = (await files(root)).filter((file) => file.endsWith(".html"));
const pages = new Map();
for (const file of htmlFiles) {
  const path = relative(root, file) === "404.html" ? "/404/" : `/${relative(root, file).replace(/index\.html$/, "")}`;
  const html = await readFile(file, "utf8");
  const page = { path, title: "", text: "", h1: 0, headings: [], ids: new Set(), references: [], links: [], assets: [], schemas: [], meta: {}, canonical: "", allowlist: [], analyticsConfigured: html.includes("window.__FRNQ_ANALYTICS__"), consentChoices: [], consentSettings: 0 };
  let schemaText = "";
  await new HTMLRewriter()
    .on("html", { element(el) { check(el.getAttribute("lang") === "es", `${path}: idioma`); page.allowlist = (el.getAttribute("data-track-pages") ?? "").split("|"); } })
    .on("title", { text(chunk) { page.title += chunk.text; } })
    .on("body", { text(chunk) { page.text += ` ${chunk.text}`; } })
    .on("meta", { element(el) { page.meta[el.getAttribute("name") ?? el.getAttribute("property")] = el.getAttribute("content"); } })
    .on("link", { element(el) {
      if (el.getAttribute("rel") === "canonical") page.canonical = el.getAttribute("href");
      if (["stylesheet", "icon"].includes(el.getAttribute("rel"))) page.assets.push(el.getAttribute("href"));
    } })
    .on("*", { element(el) {
      const id = el.getAttribute("id");
      if (id) { check(!page.ids.has(id), `${path}: id duplicado ${id}`); page.ids.add(id); }
      for (const attr of ["aria-labelledby", "aria-describedby", "aria-controls"]) {
        if (el.getAttribute(attr)) page.references.push(...el.getAttribute(attr).split(/\s+/));
      }
      if (/^h[1-6]$/.test(el.tagName)) { page.headings.push(Number(el.tagName[1])); if (el.tagName === "h1") page.h1++; }
    } })
    .on("a", { element(el) { const href = el.getAttribute("href"); if (href) page.links.push(href); } })
    .on("[data-consent-choice]", { element(el) { page.consentChoices.push(el.getAttribute("data-consent-choice")); } })
    .on("[data-analytics-settings]", { element() { page.consentSettings++; } })
    .on("script[src]", { element(el) { check(!el.getAttribute("src")?.startsWith("https://www.googletagmanager.com/"), `${path}: etiqueta GA cargada fuera del consentimiento`); } })
    .on("img", { element(el) {
      check(el.hasAttribute("alt"), `${path}: imagen sin alt`);
      if (el.getAttribute("src")) page.assets.push(el.getAttribute("src"));
    } })
    .on('script[type="application/ld+json"]', {
      element(el) { schemaText = ""; el.onEndTag(() => {
        try { page.schemas.push(JSON.parse(schemaText)); }
        catch { failures.push(`${path}: JSON-LD inválido`); }
      }); },
      text(chunk) { schemaText += chunk.text; },
    })
    .transform(new Response(html)).text();
  page.title = normalize(page.title);
  page.text = normalize(page.text);
  pages.set(path, page);
}

const titles = new Set();
const descriptions = new Set();
let faqCount = 0;
for (const [path, page] of pages) {
  check(page.h1 === 1, `${path}: se esperaba un H1, hay ${page.h1}`);
  check(page.title.length > 0 && page.title.length <= 65 && !titles.has(page.title), `${path}: title vacío, largo o duplicado`);
  titles.add(page.title);
  const description = page.meta.description;
  check(description && description.length <= 160 && !descriptions.has(description), `${path}: description vacía, larga o duplicada`);
  descriptions.add(description);
  check(page.canonical === `${siteConfig.url}${path}`, `${path}: canonical ${page.canonical}`);
  check(page.meta["og:url"] === page.canonical && page.meta["og:title"] === page.title && page.meta["og:description"] === description, `${path}: Open Graph no coincide`);
  check(page.meta["og:image:alt"] && page.meta["twitter:image"] === page.meta["og:image"], `${path}: imagen social incompleta`);
  const expectedRobots = path === "/404/" ? "noindex, nofollow" : path.startsWith("/legal/") ? "noindex, follow" : "index, follow";
  check(page.meta.robots === expectedRobots, `${path}: robots ${page.meta.robots}`);
  check(page.schemas.length > 0, `${path}: falta JSON-LD`);
  check(page.ids.has("analytics-consent") === page.analyticsConfigured && page.consentSettings === (page.analyticsConfigured ? 1 : 0), `${path}: consentimiento/preferencias no coincide con la configuración GA4`);
  check(JSON.stringify(page.consentChoices.sort()) === JSON.stringify(page.analyticsConfigured ? ["false", "true"] : []), `${path}: deben existir tanto aceptación como rechazo, solo con GA4 configurado`);
  for (const id of page.references) check(page.ids.has(id), `${path}: referencia ARIA sin destino #${id}`);
  for (let index = 1; index < page.headings.length; index++) check(page.headings[index] <= page.headings[index - 1] + 1, `${path}: salto de encabezados h${page.headings[index - 1]} → h${page.headings[index]}`);
  check(page.allowlist.length === pages.size && new Set(page.allowlist).size === pages.size && [...pages.keys()].every((route) => page.allowlist.includes(route)), `${path}: allowlist de analítica no coincide con las rutas`);
  for (const href of page.links) {
    const target = new URL(href, page.canonical);
    if (target.origin !== siteConfig.url) continue;
    const destination = pages.get(target.pathname);
    check(Boolean(destination), `${path}: enlace interno roto ${href}`);
    if (destination && target.hash) check(destination.ids.has(decodeURIComponent(target.hash.slice(1))), `${path}: fragmento sin destino ${href}`);
  }
  for (const asset of [...page.assets, page.meta["og:image"]]) {
    const target = new URL(asset, page.canonical);
    if (target.origin !== siteConfig.url) continue;
    check(await stat(join(root, target.pathname)).then((entry) => entry.isFile()).catch(() => false), `${path}: recurso ausente ${asset}`);
  }
  for (const schema of page.schemas.filter((entry) => entry["@type"] === "FAQPage")) {
    for (const question of schema.mainEntity) {
      faqCount++;
      check(page.text.includes(normalize(question.name)) && page.text.includes(normalize(question.acceptedAnswer.text)), `${path}: FAQ no coincide con el contenido visible`);
    }
  }
}

const sitemapFiles = (await readdir(root)).filter((name) => /^sitemap-\d+\.xml$/.test(name));
const sitemap = (await Promise.all(sitemapFiles.map((name) => readFile(join(root, name), "utf8")))).join("");
const locations = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
const indexable = [...pages.values()].filter((page) => page.meta.robots === "index, follow").map((page) => page.canonical);
check(locations.length === indexable.length && indexable.every((url) => locations.includes(url)), "Sitemap: las URLs no coinciden con las páginas indexables");

for (const solution of solutionPages) {
  const page = pages.get(`/soluciones/${solution.slug}/`);
  check(page?.links.includes(`/?tipo=${solutionContactTypes[solution.id]}#contacto`), `${solution.slug}: CTA sin preselección`);
}
for (const [path, type] of [["/colaboraciones/agencias/", "agencia"], ["/soluciones/revision-web/", "reparacion"], ["/soporte/", "soporte"]]) {
  check(pages.get(path)?.links.includes(`/?tipo=${type}#contacto`), `${path}: CTA sin tipo correcto`);
}
for (const slug of ["kingbelt", "emilio-faraoni", "ilifielt"]) check(pages.get(`/casos/${slug}/`)?.text.includes("Publicado"), `${slug}: estado no visible`);
const expectedPrices = pricingGroups.flatMap((group) => group.offers.map(lineAmount).filter((amount) => amount !== undefined)).sort((a, b) => a - b);
const catalog = pages.get("/precios/")?.schemas.find((schema) => schema["@type"] === "OfferCatalog");
const actualPrices = catalog?.itemListElement.map((offer) => offer.priceSpecification.price ?? offer.priceSpecification.minPrice).sort((a, b) => a - b);
check(JSON.stringify(actualPrices) === JSON.stringify(expectedPrices), "Precios: OfferCatalog no coincide con la fuente única");
for (const offer of pricingGroups.flatMap((group) => group.offers).filter((offer) => lineAmount(offer) !== undefined)) {
  const specification = catalog?.itemListElement.find((entry) => entry.name === offer.name)?.priceSpecification;
  check(specification?.[offer.mode === "fixed" ? "price" : "minPrice"] === lineAmount(offer), `Precios: ${offer.name} no distingue precio fijo y de partida`);
  check(specification?.valueAddedTaxIncluded === false && specification?.priceCurrency === "EUR", `Precios: ${offer.name} sin moneda/impuestos coherentes`);
  if (lineBilling(offer) === "monthly") check(specification?.["@type"] === "UnitPriceSpecification" && specification?.billingDuration === "P1M", `Precios: ${offer.name} sin periodicidad mensual`);
}
const supportSpecification = pages.get("/soporte/")?.schemas.find((schema) => schema["@type"] === "Service")?.offers?.priceSpecification;
check(supportSpecification?.["@type"] === "UnitPriceSpecification" && supportSpecification?.billingDuration === "P1M" && supportSpecification?.minPrice === supportPrice?.amount && supportSpecification?.valueAddedTaxIncluded === false, "Soporte: el precio debe ser mínimo, mensual y sin impuestos");
check((await readFile(join(root, "contact-result.css"), "utf8")).includes("--bg"), "Falta la hoja de resultado nativo con tokens compartidos");

if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`QA estático OK: ${pages.size} páginas, ${locations.length} URLs en sitemap, ${[...pages.values()].reduce((sum, page) => sum + page.schemas.length, 0)} bloques JSON-LD, ${faqCount} FAQ. Metadatos, canonicals, ARIA, enlaces, recursos, precios, estados y CTA coherentes.`);
}
