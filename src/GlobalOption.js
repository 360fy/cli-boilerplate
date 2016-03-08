import Commander from 'commander';

export default function (flags, description, fn, defaultValue) {
    return Commander.option(flags, description, fn, defaultValue);
}