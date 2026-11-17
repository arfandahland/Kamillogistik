import { buildApp } from "./app";
import { createSeedRepo } from "./seed";

const port = Number(process.env.PORT ?? 4000);
const app = buildApp(createSeedRepo());
app.listen({ port, host: "0.0.0.0" }).then(() => console.log(`API siap di :${port} (data demo)`));
