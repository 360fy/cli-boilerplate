# command-line-boilerplate

## Example
```
import globalOption from 'command-line-boilerplate/lib/GlobalOption';
import globalArg from 'command-line-boilerplate/lib/GlobalArg';
import runCli from 'command-line-boilerplate/lib/CliRunner';
import outputHelp from 'command-line-boilerplate/lib/OutputHelp';

// more such global options can be defined
globalOption('-c, --config [CONFIG]', 'Path to JSON / YAML based environment configs, such as esConfig, redisConfig etc');

// runs the cli
runCli(true);

// extract command line args
const config = globalArg('config');
if (!config) {
    console.error('No config was specified');

    // output formatted cli help
    outputHelp();

    return false;
}

// do other tasks
```
