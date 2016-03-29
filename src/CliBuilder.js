import Commander from 'commander';
import Promise from 'when';
import {spawn} from 'child_process';
import {default as path, dirname} from 'path';
import Chalk from 'chalk';
import {readlinkSync as readlink} from 'graceful-readlink';

function handleCommandResponse(promise) {
    Promise.resolve(promise)
      .then((result) => {
          console.log(Chalk.green('Response: '), result);
          process.exit(0);
      })
      .catch((error) => {
          console.error(Chalk.red('Error: '), error, error.stack);
          process.exit(1);
      });
}

export class Command {
    constructor(name) {
        this.name = name;
        this.command = Commander.command(name);
    }

    option(flags, description, fn, defaultValue) {
        this.command.option(flags, description, fn, defaultValue);

        return this;
    }

    description(text) {
        this.command.description(text);

        return this;
    }

    action(fn, params) {
        if (params && params.memorySize) {
            this.command.option('--spawned', 'Indicates that process is spawned one');
        }

        this.command.action(args => {
            global.currentCommand = this.name;

            if (!params || !params.watch) {
                return handleCommandResponse(fn(args));
            }

            // it's a long running process
            if (params.memorySize && !args.spawned) {
                // we need to spawn a child process
                const executable = process.argv[1];

                // In case of globally installed, get the base dir where executable
                // command file should be located at
                let link = readlink(executable);

                // when symbolink is relative path
                if (link !== executable && link.charAt(0) !== '/') {
                    link = path.join(dirname(executable), link);
                }

                let isJSExecutable = false;
                if (link.match(/\.js$/)) {
                    isJSExecutable = true;
                }

                let processArgs = process.argv.slice(2);
                processArgs.push('--spawned');

                let proc;
                if (isJSExecutable) {
                    // add executable arguments to spawn
                    processArgs = (process.execArgv || [])
                      .concat(['--optimize_for_size', `--max_old_space_size=${params.memorySize}`, `--gc_interval=${params.gcInterval || 50}`, link])
                      .concat(processArgs);

                    proc = spawn('node', processArgs, {stdio: 'inherit', customFds: [0, 1, 2]});
                } else {
                    if (process.platform !== 'win32') {
                        proc = spawn(link, processArgs, {stdio: 'inherit', customFds: [0, 1, 2]});
                    } else {
                        processArgs.unshift(link);
                        proc = spawn(process.execPath, processArgs, {stdio: 'inherit'});
                    }
                }

                proc.on('close', process.exit.bind(process));
                proc.on('error', (err) => {
                    if (err.code === 'ENOENT') {
                        console.error('\n  %s(1) does not exist, try --help\n', link);
                    } else if (err.code === 'EACCES') {
                        console.error('\n  %s(1) not executable. try chmod or run with root\n', link);
                    }
                    process.exit(1);
                });

                // Store the reference to the child process
                //this.runningCommand = proc;
            } else {
                // if it is spawned process or memory size is not set, we behave normal
                return fn(args);
            }

            return null;
        });

        return this;
    }
}