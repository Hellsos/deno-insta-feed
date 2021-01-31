import { loadEnv } from "../../deps.ts";

interface IEnvStructure {
	Http : {
		port : number;
	}
	Instagram : {
		appId : string;
		appSecret : string;
		redirectUri : string;
	},
	Mysql : {
		hostname : string;
		password : string;
		port : number;
		username : string;
		db : string;
	}

}

const env : IEnvStructure = await loadEnv<IEnvStructure>();

export {
	env
};
