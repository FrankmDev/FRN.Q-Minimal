import css from "../styles/contact-result.css?inline";

/** Static stylesheet used by POST /api/contact's script-free result document. */
export function GET() {
  return new Response(css, { headers: { "Content-Type": "text/css; charset=utf-8" } });
}
