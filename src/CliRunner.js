import Commander from 'commander';
import Chalk from 'chalk';

//import FS from 'fs';

export default function () {
    Commander.parse(process.argv);

    if (!process.argv.slice(2).length) {
        Commander.outputHelp(Chalk.red);
    }
}