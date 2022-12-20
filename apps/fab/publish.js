import { Command } from 'commander'
import { exec } from 'child_process'
import { env } from 'process'
import dotenv from 'dotenv'
import fs from 'fs'

const program = new Command();
program
	.version('1.0.0', '-v, --version')
	.usage('[OPTIONS]...')
	.option('-e, --env <env_file>', 'The env file to process')
	.parse(process.argv);

const options = program.opts();
const envFile = fs.readFileSync("./env/.env-" + options.env, "utf8");
fs.writeFileSync('./.env', envFile)
dotenv.config()

exec("astro build", (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);

	fs.writeFileSync('./dist/CNAME',process.env.APP_URL)
	exec('cd dist && git init && git add . && git commit -m "auto-push" && git branch -M main && git remote add origin git@github.com:' + env.REPO + '.git && git push -f -u origin main', (error, stdout, stderr) => {
		if (error) {
			console.log(`error: ${error.message}`);
			return;
		}
		if (stderr) {
			console.log(`stderr: ${stderr}`);
			return;
		}
		console.log(`stdout: ${stdout}`);
	});
});
