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

### More examples link
* https://github.com/360fy/humane-pipeline/blob/master/src/CliInvoker.js
* https://github.com/360fy/humane-discovery/blob/master/src/CliInvoker.js
* See how we can build a CLI programmatically https://github.com/360fy/humane-pipeline/blob/master/src/PipelineCliBuilder.js (also notice how we can have gcInterval and memorySize as command line args. Very convenient when running a program from global path - i.e. without `node <program>` syntax, but with `<program>` syntax)
