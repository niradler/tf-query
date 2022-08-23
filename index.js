#!/usr/bin/env node
const path = require("path");
const fs = require("fs");
const getPath = require("lodash.get")
const hcl = require("hcl2-parser")
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')

const args = yargs(hideBin(process.argv))
    .option('path', {
        alias: 'p',
        type: 'string',
        default: path.join(process.cwd(), 'main.tf'),
        description: 'path to file'
    })
    .option('type', {
        alias: 't',
        type: 'string',
        description: 'block type, aws_instance, etc...'
    })
    .option('block', {
        alias: 'b',
        type: 'string',
        description: 'block, resource, variable, etc...',
    })
    .option('name', {
        alias: 'n',
        type: 'string',
        description: 'block name.'
    })
    .option('output', {
        alias: 'o',
        type: 'string',
        default: 'json',
        description: 'json, newline'
    })
    .option('query', {
        alias: 'q',
        type: 'string',
        description: 'query file data, variable.network_interface_id'
    })
    .option('verbose', {
        alias: 'v',
        type: 'boolean',
        default: false,
        description: 'Run with verbose logging'
    })
    .parse();

if (args.verbose)
    console.log(args);

const file = fs.readFileSync(args.path, "utf-8");
const hclObj = hcl.parseToObject(file)

const parse = (file) => {
    let term
    if (args.block) {
        term = Object.keys(file[args.block])
        if (args.type) {
            if (term.includes(args.type)) {
                term = file[args.block][args.type]
                if (args.name) {
                    term = file[args.block][args.type][args.name]
                }
            }

        } else if (args.name) {
            term = file[args.block][args.name]
        }
    } else if (args.query) {
        term = getPath(file, args.query)
    } else {
        term = file
    }

    return term
}

const output = (out) => {
    switch (args.output) {
        case 'json':
            console.log(JSON.stringify(out, null, 2));
            break;
        case 'newline':
            if (Array.isArray(out)) {
                console.log(out.join('\n'));
            } else {
                console.log(out);
            }
            break;
    }
}

const out = hclObj.filter(file => file).map(file => file ? parse(file) : "")[0]

output(out);