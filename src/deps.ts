export { loadEnv } from "https://deno.land/x/dotenvfile/mod.ts";
export { Application, Router, Context, HttpError } from "https://deno.land/x/oak/mod.ts";
export { Client } from "https://deno.land/x/mysql/mod.ts";
import { Context } from "https://deno.land/x/oak/mod.ts";

export { moment } from "https://deno.land/x/deno_moment/mod.ts";

export interface IContext extends Context {
	params : { [ key : string ] : string };
}
