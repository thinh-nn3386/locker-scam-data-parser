"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const csv_parser_1 = __importDefault(require("csv-parser"));
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const FILE_CONFIGS = {
    'sola.csv': {
        numberField: 'number',
        typeField: 'fullName'
    },
    'CleanCall.csv': {
        numberField: 'phone_number',
        typeField: 'name'
    },
    'ntrust_part1.csv': {
        numberField: 'dial_id',
        typeField: 'type_tag'
    },
    'ntrust_part2.csv': {
        numberField: 'dial_id',
        typeField: 'type_tag'
    },
    'ntrust_part3.csv': {
        numberField: 'dial_id',
        typeField: 'type_tag'
    }
};
class Cleaner {
    constructor(inputFileName = 'sola.csv') {
        // Use process.cwd() to get the current working directory instead of __dirname
        this.inputFilePath = (0, path_1.join)(process.cwd(), 'data', inputFileName);
        this.outputDir = (0, path_1.join)(process.cwd(), 'clean-data');
        this.outputFileName = inputFileName;
        // Get configuration for this file type
        this.config = FILE_CONFIGS[inputFileName];
        if (!this.config) {
            throw new Error(`No configuration found for file: ${inputFileName}`);
        }
    }
    async cleanData() {
        try {
            // Ensure output directory exists
            if (!(0, fs_1.existsSync)(this.outputDir)) {
                (0, fs_1.mkdirSync)(this.outputDir, { recursive: true });
            }
            const outputFilePath = (0, path_1.join)(this.outputDir, this.outputFileName);
            const records = [];
            // Read and process CSV
            await new Promise((resolve, reject) => {
                (0, fs_1.createReadStream)(this.inputFilePath)
                    .pipe((0, csv_parser_1.default)())
                    .on('data', (row) => {
                    // Use dynamic field mapping based on configuration
                    const numberValue = row[this.config.numberField];
                    const typeValue = row[this.config.typeField];
                    // Skip rows with missing required fields
                    if (!numberValue || !typeValue) {
                        return;
                    }
                    const cleanedRecord = {
                        number: numberValue,
                        type: this.config.transformType ? this.config.transformType(typeValue) : typeValue
                    };
                    records.push(cleanedRecord);
                })
                    .on('end', () => {
                    console.log(`Processed ${records.length} records from ${this.outputFileName}`);
                    resolve();
                })
                    .on('error', (error) => {
                    reject(error);
                });
            });
            // Write cleaned data to output file
            const csvWriter = createCsvWriter({
                path: outputFilePath,
                header: [
                    { id: 'number', title: 'number' },
                    { id: 'type', title: 'type' }
                ]
            });
            await csvWriter.writeRecords(records);
            console.log(`Cleaned data saved to: ${outputFilePath}`);
            console.log(`Total records: ${records.length}`);
        }
        catch (error) {
            console.error('Error processing CSV:', error);
            throw error;
        }
    }
    // Method to run the cleaning process for a single file
    static async run(inputFileName) {
        const cleaner = new Cleaner(inputFileName);
        await cleaner.cleanData();
    }
    // Method to run the cleaning process for multiple files
    static async runMultiple(fileNames) {
        console.log(`Starting batch processing for ${fileNames.length} files...`);
        for (const fileName of fileNames) {
            try {
                console.log(`\n--- Processing ${fileName} ---`);
                await Cleaner.run(fileName);
            }
            catch (error) {
                console.error(`Error processing ${fileName}:`, error);
                // Continue with other files even if one fails
            }
        }
        console.log('\n--- Batch processing completed ---');
    }
    // Method to run all configured files
    static async runAll() {
        const allFiles = Object.keys(FILE_CONFIGS);
        await Cleaner.runMultiple(allFiles);
    }
}
exports.default = Cleaner;
//# sourceMappingURL=Cleaner.js.map