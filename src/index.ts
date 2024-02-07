export interface Env {
	IG_TOKENS: any;
}

export default {
	async fetch(request: any, env: Env, ctx: any) {
		const { searchParams } = new URL(request.url);
		const profileName = searchParams.get('profile');

		const key = await env.IG_TOKENS.get(profileName);

		try {
			const response = await fetch(
				`https://graph.instagram.com/me/media?fields=id,caption,media_url,timestamp,media_type,permalink&access_token=${await env.IG_TOKENS.get(
					profileName
				)}`
			);
			return response;
		} catch (error) {
			return new Response(JSON.stringify({ error: error }), {
				status: 500,
				headers: { 'Content-Type': 'application/json' },
			});
		}
	},
	async scheduled(event: any, env: any, ctx: any) {
		console.log('Cron started');
		const accounts = await env.IG_TOKENS.list();

		loop: for (const account of accounts.keys) {
			const token = await env.IG_TOKENS.get(account.name);

			try {
				const response = await fetch(`https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${token}`);
				if (response.ok) {
					const data: any = await response.json();
					const newToken = data.access_token;
					console.log('NEW TOKEN:' + newToken);
					console.log('OLD TOKEN:' + token);
					if (token !== newToken) {
						await env.IG_TOKENS.put(account.name, newToken);
						console.log('Successfully updated token for ' + account.name);
						continue loop;
					}
					console.log('Failed to update token for ' + account.name + ': too soon (token is still functional)');
					continue loop;
				}
				console.error('A ' + response.status + ' error occurred, ' + (await response.text()));
			} catch (error) {
				console.error('An error occurred when fetching new token for ' + account.name + ': ' + error);
			}
		}
	},
};
