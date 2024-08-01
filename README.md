# Instagram Gallery Worker

This tool automatically manages and refreshes access tokens for the Instagram Basic Display API, and acts as a proxy layer for it. This makes it perfect for static or Jamstack-type sites.

It is built to run on [Cloudflare Workers](https://workers.cloudflare.com/) using [Cloudflare Workers KV](https://developers.cloudflare.com/kv/) because they are fast and free to use (up to 100,000 requests per day).

## Setup guide

1. Install the [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) and authorise it to access your Cloudflare account.
2. Clone this repo and run `pnpm install`.
3. Create a `wrangler.toml` file in the root of this project, and copy the contents of `example.wrangler.toml` into it.
4. Run `wrangler kv:namespace create IG_TOKEN`.
5. Copy the output and paste it in the `kv_namespaces` array in `wrangler.toml`.
6. Obtain an Instagram API access token for your account by following steps 1–4 from [this tutorial](https://docs.oceanwp.org/article/487-how-to-get-instagram-access-token).
7. Run the command `wrangler kv:key put [YOUR IG USERNAME HERE] [YOUR IG ACCESS TOKEN HERE] --binding=IG_TOKENS` (using your username and access token where it says). If you intend to run the script locally, run the command again with the `--local` argument.
8. Now, simply run `wrangler deploy` (or `wrangler dev` to test locally).

### Multiple users

It is possible to have multiple Instagram profiles on one Worker. Simply repeat steps 6 and 7 for each additional profile.

## Usage

You can find the URL for your worker either through the output of the `wrangler deploy` command, or through the online Cloudflare dashboard. For the sake of this guide, it will be referred to as `https://gallery.workers.dev`.

To access your Instagram data, you just need to provide your desired fields and the username of the profile you would like to request (given that you have set it up with step 7 of the Setup guide) as URL parameters. You can find out which fields are available [here](https://developers.facebook.com/docs/instagram-basic-display-api/reference/media#fields). There is no authentication by design; this tool was made with static/Jamstack sites in mind (where it is unsafe to use credentials). All of the data it can provide is publicly accessible anyway, so it shouldn't matter.

For example, a request URL could look like `https://gallery.workers.dev/?fields=caption,thumbnail_url,media_url,media_type,timestamp,permalink&profile=instagramprofile`.

The responses (successful and unsuccessful) are sent directly back from the Instagram API, and so information about them can be found on the [Instagram Basic Display API reference](https://developers.facebook.com/docs/instagram-basic-display-api/reference/media).

### Automatic token refreshing

The main feature of this project is that it automatically refreshes your access token(s), which was a pain point when working with the Instagram Basic Display API (especially on static/Jamstack sites). With the default configuration, at midnight on every Thursday (UTC time) each token in the KV namespace is attempted to be refreshed.
