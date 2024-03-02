# Instagram Gallery Worker

This is a tool which acts as a pass through layer for the Instagram Display API. Responses are meant to exactly match those provided by the official API. The only difference is this tool automatically manages and updates access tokens, requiring no human intervention. This makes it perfect for Jamstack-type sites.

It is build to run on [Cloudflare Workers](https://workers.cloudflare.com/) and [Cloudflare Workers KV](https://developers.cloudflare.com/kv/) because they are fast, free (up to 100,000 requests per day) and flexible.

## Set up guide

1. Install the [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) and authorise it to access your Cloudflare account.
2. Clone this repo.
3. Create a `wrangler.toml` file in the root of this project, and copy and paste. the contents of `example.wrangler.toml` into it
4. Run `bash wrangler kv:namespace create IG_TOKEN` in the root of this project.
5. Copy and paste the `id` section of the output and paste it into your `wrangler.toml` file in the `id` section there
6. Now you need your Instagram access token. You can follow steps 1 - 4 from [this tutorial](https://docs.oceanwp.org/article/487-how-to-get-instagram-access-token) in order to obtain it.
7. Run the command `wrangler kv:key put [YOUR IG USERNAME HERE] [YOUR IG ACCESS TOKEN HERE] --binding=IG_TOKENS`.
8. Now, simply run `wrangler deploy`.

### Multiple users

It is possible to access multiple users' data from one Worker. Simply get the access token and repeat step 7 for each additional account.

## Usage

You can find the URL for your worker either through the output of the `wrangler deploy` command, or through the online Cloudflare dashboard. For the sake of this guide, we will refer to it as `https://gallery.workers.dev`.

To access your Instagram data, you just need to provide your desired fields and the username of the profile you would like to request (given that you have set it up with step 7 of the Setup guide) as URL parameters. You can find out which fields are available [here](https://developers.facebook.com/docs/instagram-basic-display-api/reference/media#fields). There is currently no authentication, but that shouldn't be necessary since the data is public anyway.

For example, a request URL could look like `https://gallery.workers.dev/?fields=caption,thumbnail_url,media_url,media_type,timestamp,permalink&profile=instagramprofile`.

The responses (successful and unsuccessful) are sent directly back from the Instagram API, and so information about them can be found on the [Instagram Basic Display API reference](https://developers.facebook.com/docs/instagram-basic-display-api/reference).
