import CTA from "@/components/buttons/cta.tsx";
import Deletion from "@/islands/events/components/delete.tsx";
import { useSignal } from "@preact/signals";

const DeleteToken = () => {
	const open = useSignal(false);

	return (
		<Deletion
			name="authentication token"
			fetch={() => fetch("/api/auth/regen")}
			open={open}
			routeTo="/"
			customMsg="Resetting your authentication token will log you out of all devices. Please proceed with caution!"
		>
			<CTA btnType="secondary" onClick={() => (open.value = true)} btnSize="sm">
				Delete Token
			</CTA>
		</Deletion>
	);
};

export default DeleteToken;
