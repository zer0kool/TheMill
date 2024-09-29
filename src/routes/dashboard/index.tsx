import { component$, useContext } from "@builder.io/qwik";
import { AuthContext } from "~/routes/layout";
import Login from "~/components/Admin/Auth/Login";
import { MenuManager } from "~/components/Admin/MenuManager/MenuManager";

// Define the type for authState
type AuthState = {
    user?: {
        email: string;
    };
};

export default component$(() => {
    // Assuming authState is defined somewhere in your code
    const authState = useContext(AuthContext) as AuthState;

    return (
        <div class="container mx-auto p-4">
            {authState.user ? (
                <div class="dash">
                    <p>Welcome, {authState.user.email}!</p>
                    <MenuManager />
                </div>
            ) : (
                <div>
                    <Login />
                </div>
            )}
        </div>
    );
});
