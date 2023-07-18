import express, { Application } from 'express';
// import cluster from 'cluster';
import readline from 'readline';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import { configHandler, configuration } from './config';
import { heroRouter } from './routes';
import { BASE_URL, HEROES_URL } from './constants';

export class App {
	app: Application | undefined = express(); //creation of the propertie "application"

	port: number | string = 3000;

	rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});

	constructor(port?: number | string) {
		if (port) this.port = port;
		this.app = express(); //app type aplication receive "express()"
		this.settings(); //add settings
		this.middlewares(); //add middlewares
		this.routes(); //add routes
	}

	private async settings() {
		configHandler.setConfig('service', 'fs');

		// Configuración inicial
		// 		while (!configuration.service) {
		// 		  await new Promise((resolve) => {
		// 			this.rl.question(`Choose Type of service used:
		// (1) fileSystem. (default)
		// (2) mySQL. \n
		// `, (answer) => {
		// 			  switch (answer) {
		// 				case '1':
		// 				  configHandler.setConfig('service', 'fs');
		// 				  break;
		// 				case '2':
		// 				  configHandler.setConfig('service', 'mysql');
		// 				  break;
		// 				default:
		// 				  configHandler.setConfig('service', 'fs');
		// 				  break;
		// 			  }
		// 			  resolve(undefined);
		// 			});
		// 		  });
		// 		}
		// 		this.rl.close();
	}

	private middlewares() {
		this.app?.use(morgan('dev')); //Morgan establishment
		this.app?.use(express.json());
		this.app?.use(
			bodyParser.urlencoded({
				extended: true,
			})
		);
		this.app?.set('etag', false);	
	}
	

	private routes() {
		this.app?.use(`${BASE_URL}${HEROES_URL}`, heroRouter);
	}

	async listen(): Promise<void> {
		await this.app?.listen(this.port);
		console.log(
			`Server Master displayed in port[${this.port}]`
		);
	}
}
