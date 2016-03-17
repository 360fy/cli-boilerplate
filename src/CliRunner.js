import Commander from 'commander';
import Chalk from 'chalk';

//import FS from 'fs';

export default function (noAutoHelp) {
    Commander.parse(process.argv);

    if (!noAutoHelp && !process.argv.slice(2).length) {
        Commander.outputHelp(Chalk.red);
    }
}