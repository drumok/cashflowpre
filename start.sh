#!/bin/sh

# Create missing manifest files if they don't exist
mkdir -p .next
touch .next/prerender-manifest.json 2>/dev/null || true
echo '{"version":4,"routes":{"/":{"initialRevalidateSeconds":false,"srcRoute":"/","dataRoute":null,"prefetchDataRoute":null}},"dynamicRoutes":{},"notFoundRoutes":[],"preview":{"previewModeId":"development-id","previewModeSigningKey":"development-key","previewModeEncryptionKey":"development-key"}}' > .next/prerender-manifest.json 2>/dev/null || true

touch .next/routes-manifest.json 2>/dev/null || true
echo '{"version":4,"pages404":true,"basePath":"","redirects":[],"rewrites":[],"headers":[],"dataRoutes":[],"dynamicRoutes":[],"staticRoutes":[{"page":"/","regex":"^/$","routeKeys":{},"namedRegex":"^/$"},{"page":"/404","regex":"^/404/?$","routeKeys":{},"namedRegex":"^/404/?$"}],"rsc":{"header":"RSC","varyHeader":"RSC, Next-Router-State-Tree, Next-Router-Prefetch"},"skipMiddlewareUrlNormalize":false,"caseSensitive":false}' > .next/routes-manifest.json 2>/dev/null || true

# Start the Next.js application
exec npm start