import { inferAdditionalFields, jwtClient } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"
import { auth } from "./auth"

export const authClient = createAuthClient({
    /** The base URL of the server (optional if you're using the same domain) */
    baseURL: "http://localhost:3000",
    plugins: [
        inferAdditionalFields<typeof auth>(),
        jwtClient(),
    ],

})


export const { signIn, signUp, useSession } = authClient