import Commander from 'commander';
import Chalk from 'chalk';

export default function () {
    Commander.outputHelp(Chalk.red);
}