import { handleAuth, handleLogin } from "@auth0/nextjs-auth0";

console.log("base url: ", process.env.AUTH0_BASE_URL);

export default handleAuth({
    signup: handleLogin({authorizationParams: {screen_hint: "signup"}}),
});