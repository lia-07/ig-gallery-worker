export interface Env {
	IG_TOKENS: KVNamespace;
}

export default {
	async fetch(request: { url: string }, env: Env, ctx: ExecutionContext) {
		const { searchParams } = new URL(request.url);
		const key = await env.IG_TOKENS.get(searchParams.get('profile')!);
		const fields = searchParams.get('fields');

		if (!key)
			return new Response('You must provide a valid profile name!', {
				status: 400,
			});

		try {
			return await fetch(`https://graph.instagram.com/me/media?fields=${fields}&access_token=${key}`);
		} catch (e) {
			return new Response(`An error occurred: ${e}`, {
				status: 500,
			});
		}
	},

	async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
		console.info('Cron started');

		const accounts = await env.IG_TOKENS.list();

		for (const account of accounts.keys) {
			const token = await env.IG_TOKENS.get(account.name);

			try {
				const response = await fetch(`https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${token}`);

				if (!response.ok) {
					console.error(`A ${response.status} error occurred when updating token for ${account.name}:  ${await response.text()} `);
					continue;
				}

				const data: { access_token: string } = await response.json();

				await env.IG_TOKENS.put(account.name, data.access_token);

				console.info('Successfully updated token for ' + account.name);
			} catch (e) {
				console.error('An error occurred when fetching new token for ' + account.name + ': ' + e);
			}
		}
	},
};
