import DeleteToken from "@/islands/components/pieces/deleteToken.tsx";


const Settings = () => {
	return (
		<div class="grid gap-4">
			<h2 class="text-xl font-semibold">Delete Authentication Token</h2>
			<p class="text-sm">Resetting your authentication token can enhance your account security by invalidating any compromised tokens or connections, reducing the risk of unauthorized access to your sensitive information or resources. Additionally, it provides a fresh start, ensuring that only authorized devices or applications can access your account going forward.</p>
			<DeleteToken />
		</div>
	)
}

export default Settings;