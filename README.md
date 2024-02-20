# Instagram Gallery Worker

This is a tool which acts as a pass through layer for the Instagram Display API.
Responses are meant to exactly match those provided by the official API. The
only difference is this tool automatically manages and updates access tokens,
requiring no human intervention. It is build to run on [Cloudflare
Workers](https://workers.cloudflare.com/) and [Cloudflare Workers
KV](https://developers.cloudflare.com/kv/) because they are fast, free\* and
flexible.

Documentation coming soon.

\*As long as it gets less than 100,000 requests per day.
