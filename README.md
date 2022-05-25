# auto-cors
A proxy to automatically add CORS headers, supports:

- Simple requests with `Access-Control-Allow-Origin: "*"`
- OPTIONS preflight request for non-simple requests.
- CORS request with crendentials included.

There's an `auto-cors` service deployed at cors.harttle.com, for example: <http://cors.harttle.com/https://example.com>

## Install

```bash
npm i auto-cors
```

## Use in Node.js

```javascript
const cors = require("auto-cors")
const port = process.env.PORT || 8080;
cors.server.listen(port, () => {
    console.log(`server listening to ${port}`);
});
```

Visit <http://localhost:8080/https://example.com> in your browser.

## Use in command line

```bash
npx auto-cors
```

The default port is 8080, use `AUTO_CORS_PORT` to set a different port, for example:

```bash
AUTO_CORS_PORT=9001 npx auto-cors
```

Visit <http://localhost:9001/https://example.com> in your browser.

## Deploy your own service
