# Instagram Gallery Worker

This project aims to simplify interactions with the Instagram Basic Display API
to facilitate custom Instagram galleries on other platforms. It will
automatically manage token refreshes while providing a simplified endpoint to
collect data from. It is built to work on [Cloudflare
Workers](https://workers.cloudflare.com/) with [Cloudflare Workers
KV](https://developers.cloudflare.com/kv/) because they are free, fast, and
flexible. This tool is frontend agnostic as it simply returns JSON.
