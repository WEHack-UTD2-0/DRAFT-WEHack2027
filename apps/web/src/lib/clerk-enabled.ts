// Clerk is only turned on when a real publishable key is configured.
// Without one (e.g. local dev using the placeholder key, which points at
// example.clerk.accounts.dev), Clerk never loads and the whole page stays blank,
// so we skip Clerk and render the site as a signed-out visitor instead.
function hasRealClerkKey(key: string | undefined): boolean {
	if (!key || !/^pk_(test|live)_/.test(key)) return false;
	try {
		const host = atob(key.replace(/^pk_(test|live)_/, ""));
		return !host.startsWith("example.");
	} catch {
		return false;
	}
}

export const clerkEnabled = hasRealClerkKey(
	process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
);
