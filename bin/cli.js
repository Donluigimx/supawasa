#!/usr/bin/env node

const { Command } = require('commander');
const assert = require('assert');
const CSVParser = require('csv-parse/lib/sync');
const fs = require('fs');

const WhatsApp = require('../lib/whatsapp');

const program = new Command('supawasa');

program
  .option('-f, --file <filepath>', 'CSV file')
  .option('-d, --delay <miliseconds>', 'Delay in miliseconds taken when sending a message', 5000);

program.parse(process.argv);

async function main() {
  assert(program.file, 'File is a required variable');

  const whatsappInstance = await WhatsApp.initService();

  const delay = program.delay ? Number(program.delay) : 5000;

  const fileExists = fs.existsSync(program.file);
  assert(fileExists, 'File does not exists');

  const csvRaw = fs.readFileSync(program.file);
  const values = CSVParser(csvRaw);

  for (const row of values) {
    await whatsappInstance.sendMessage(row[0], row[1], delay);
  }

  whatsappInstance.stopService();
}

main()
  .catch(err => {
    program.help();
  })
