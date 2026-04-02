import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const routesDir = path.join(root, "public", "routes");
const indexPath = path.join(routesDir, "index.json");

/** @type {string[]} */
const errors = [];

/**
 * @param {string} msg
 */
function addError(msg) {
  errors.push(msg);
}

/**
 * @param {unknown} lat
 * @param {unknown} lng
 * @param {string} ctx
 */
function validateLatLngPair(lat, lng, ctx) {
  if (typeof lat !== "number" || !Number.isFinite(lat)) {
    addError(`${ctx}: lat must be a finite number`);
    return;
  }
  if (typeof lng !== "number" || !Number.isFinite(lng)) {
    addError(`${ctx}: lng must be a finite number`);
    return;
  }
  if (lat < -90 || lat > 90) {
    addError(`${ctx}: lat ${lat} out of range [-90, 90]`);
  }
  if (lng < -180 || lng > 180) {
    addError(`${ctx}: lng ${lng} out of range [-180, 180]`);
  }
}

/**
 * @param {unknown} v
 * @param {string} ctx
 */
function validateLatitude(v, ctx) {
  if (typeof v !== "number" || !Number.isFinite(v)) {
    addError(`${ctx}: must be a finite number`);
    return;
  }
  if (v < -90 || v > 90) {
    addError(`${ctx}: value ${v} out of range [-90, 90]`);
  }
}

/**
 * @param {unknown} v
 * @param {string} ctx
 */
function validateLongitude(v, ctx) {
  if (typeof v !== "number" || !Number.isFinite(v)) {
    addError(`${ctx}: must be a finite number`);
    return;
  }
  if (v < -180 || v > 180) {
    addError(`${ctx}: value ${v} out of range [-180, 180]`);
  }
}

/**
 * @param {string} slug
 * @param {Record<string, unknown>} data
 */
function validateRouteCoordinates(slug, data) {
  const base = `Slug "${slug}"`;

  if (Array.isArray(data.anchorRefs)) {
    data.anchorRefs.forEach((ref, i) => {
      if (!ref || typeof ref !== "object") return;
      const o = /** @type {Record<string, unknown>} */ (ref);
      const hasLat = "lat" in o;
      const hasLng = "lng" in o;
      if (!hasLat && !hasLng) return;
      if (!hasLat || !hasLng) {
        addError(
          `${base} anchorRefs[${i}]: both lat and lng required when either is present`,
        );
        return;
      }
      validateLatLngPair(o.lat, o.lng, `${base} anchorRefs[${i}]`);
    });
  }

  if (data.mapCenter != null) {
    if (typeof data.mapCenter !== "object" || Array.isArray(data.mapCenter)) {
      addError(`${base} mapCenter: expected object`);
    } else {
      const mc = /** @type {Record<string, unknown>} */ (data.mapCenter);
      const hasLat = "lat" in mc;
      const hasLng = "lng" in mc;
      if (hasLat || hasLng) {
        if (!hasLat || !hasLng) {
          addError(
            `${base} mapCenter: both lat and lng required when either is present`,
          );
        } else {
          validateLatLngPair(mc.lat, mc.lng, `${base} mapCenter`);
        }
      }
    }
  }

  if (data.bounds != null) {
    if (typeof data.bounds !== "object" || Array.isArray(data.bounds)) {
      addError(`${base} bounds: expected object`);
    } else {
      const b = /** @type {Record<string, unknown>} */ (data.bounds);
      if ("south" in b) validateLatitude(b.south, `${base} bounds.south`);
      if ("north" in b) validateLatitude(b.north, `${base} bounds.north`);
      if ("west" in b) validateLongitude(b.west, `${base} bounds.west`);
      if ("east" in b) validateLongitude(b.east, `${base} bounds.east`);
    }
  }

  if (!Array.isArray(data.routeOptions)) return;

  data.routeOptions.forEach((opt, oi) => {
    if (!opt || typeof opt !== "object") return;
    const o = /** @type {Record<string, unknown>} */ (opt);
    const poly = o.suggestedPolyline;
    if (poly === undefined || poly === null) return;
    if (!Array.isArray(poly)) {
      addError(
        `${base} routeOptions[${oi}].suggestedPolyline: expected array`,
      );
      return;
    }
    poly.forEach((pt, pi) => {
      const ctx = `${base} routeOptions[${oi}].suggestedPolyline[${pi}]`;
      if (!pt || typeof pt !== "object" || Array.isArray(pt)) {
        addError(`${ctx}: expected object with lat/lng`);
        return;
      }
      const p = /** @type {Record<string, unknown>} */ (pt);
      const hasLat = "lat" in p;
      const hasLng = "lng" in p;
      if (!hasLat || !hasLng) {
        addError(`${ctx}: missing lat or lng`);
        return;
      }
      validateLatLngPair(p.lat, p.lng, ctx);
    });
  });
}

/**
 * @param {string} slug
 */
function isSafeSlug(slug) {
  if (!slug || typeof slug !== "string") return false;
  if (slug.includes("..") || slug.includes("/") || slug.includes("\\")) {
    return false;
  }
  return true;
}

function main() {
  console.log("Validating routes (index, folders, route.json, coordinates)…");

  let rawIndex;
  try {
    rawIndex = fs.readFileSync(indexPath, "utf8");
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error(`FAIL: cannot read ${path.relative(root, indexPath)}: ${msg}`);
    process.exit(1);
  }

  let index;
  try {
    index = JSON.parse(rawIndex);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error(
      `FAIL: ${path.relative(root, indexPath)}: JSON parse error — ${msg}`,
    );
    process.exit(1);
  }

  if (!index || typeof index !== "object" || Array.isArray(index)) {
    console.error('FAIL: index.json must be a JSON object with a "routes" array');
    process.exit(1);
  }

  const routes = /** @type {Record<string, unknown>} */ (index).routes;
  if (!Array.isArray(routes)) {
    console.error('FAIL: index.json must have a "routes" array');
    process.exit(1);
  }

  for (const slug of routes) {
    if (!isSafeSlug(slug)) {
      addError(`Invalid or unsafe slug in index: ${JSON.stringify(slug)}`);
      continue;
    }

    const folder = path.join(routesDir, slug);
    const routePath = path.join(folder, "route.json");

    let st;
    try {
      st = fs.statSync(folder);
    } catch {
      addError(
        `Slug "${slug}": missing folder ${path.relative(root, folder)}`,
      );
      continue;
    }
    if (!st.isDirectory()) {
      addError(
        `Slug "${slug}": not a directory ${path.relative(root, folder)}`,
      );
      continue;
    }

    let rawRoute;
    try {
      rawRoute = fs.readFileSync(routePath, "utf8");
    } catch {
      addError(
        `Slug "${slug}": missing ${path.relative(root, routePath)}`,
      );
      continue;
    }

    let data;
    try {
      data = JSON.parse(rawRoute);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      addError(
        `Slug "${slug}" ${path.relative(root, routePath)}: JSON parse error — ${msg}`,
      );
      continue;
    }

    if (!data || typeof data !== "object" || Array.isArray(data)) {
      addError(
        `Slug "${slug}" ${path.relative(root, routePath)}: root must be a JSON object`,
      );
      continue;
    }

    validateRouteCoordinates(slug, /** @type {Record<string, unknown>} */ (data));
  }

  if (errors.length > 0) {
    console.error("FAIL: route validation found issues:\n");
    for (const line of errors) {
      console.error(`  • ${line}`);
    }
    console.error(`\n${errors.length} error(s).`);
    process.exit(1);
  }

  console.log(`PASS: ${routes.length} route(s) validated.`);
}

main();
