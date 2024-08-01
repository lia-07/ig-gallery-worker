export interface Env {
	IG_TOKENS: KVNamespace;
}

export default {
	async fetch(request: { url: string }, env: Env, ctx: ExecutionContext): Promise<Response> {
		const { searchParams } = new URL(request.url);
		const key = await env.IG_TOKENS.get(searchParams.get('profile')!);
		const fields = searchParams.get('fields');

		if (!key || !fields)
			return new Response('You must provide a both a set-up profile and desired fields as parameters', {
				status: 400,
			});

		if (!areFieldsValid(fields)) return new Response('Specified fields are invalid', { status: 400 });

		return fetchPosts(fields, key);
	},

	async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
		console.info('Token refreshment initiated');

		const accounts = await env.IG_TOKENS.list();

		for (const account of accounts.keys) {
			await refreshToken(account, env);
		}
	},
};

async function fetchPosts(fields: string, key: string): Promise<Response> {
	try {
		const params = new URLSearchParams({
			fields: fields,
			access_token: key,
		});

		return await fetch(`https://graph.instagram.com/me/media?${params}`);
	} catch (e) {
		console.error(e);
		return new Response(`An error occurred when fetching data from Instagram `, {
			status: 500,
		});
	}
}

async function refreshToken(account: KVNamespaceListKey<unknown, string>, env: Env): Promise<void> {
	const token = await env.IG_TOKENS.get(account.name);

	try {
		const params = new URLSearchParams({
			grant_type: 'ig_refresh_token',
			access_token: token!,
		});

		const response = await fetch(`https://graph.instagram.com/refresh_access_token?${params}`);

		if (!response.ok) {
			console.error(`A ${response.status} error occurred when refreshing token for ${account.name}:  ${await response.text()} `);
			return;
		}

		const data: { access_token: string } = await response.json();

		await env.IG_TOKENS.put(account.name, data.access_token);

		console.info(`Successfully refreshed token for ${account.name}`);
	} catch (e) {
		console.error(`An error occurred when refreshing token for ${account.name}: ${e}`);
	}
}

function areFieldsValid(fields: string): boolean {
	const validFields = [
		'caption',
		'id',
		'is_shared_to_feed',
		'media_type',
		'media_url',
		'permalink',
		'thumbnail_url',
		'timestamp',
		'username',
	];

	const fieldList = fields.split(',');

	return fieldList.every((field) => validFields.includes(field)) && fieldList.length === new Set(fieldList).size;
}
