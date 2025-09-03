"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const csv_parser_1 = __importDefault(require("csv-parser"));
const utils_1 = require("./utils");
const ScamType_1 = require("./ScamType");
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
            let validPhoneCount = 0;
            let invalidPhoneCount = 0;
            let skippedRows = 0;
            // Statistics for type classification
            const typeStats = {};
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
                        skippedRows++;
                        return;
                    }
                    // Validate phone number first
                    const isValidPhone = (0, utils_1.validateVietnamesePhoneNumber)(numberValue.toString());
                    // Skip invalid phone numbers entirely
                    if (!isValidPhone) {
                        invalidPhoneCount++;
                        skippedRows++;
                        return;
                    }
                    // Only process valid phone numbers
                    validPhoneCount++;
                    const formattedNumber = (0, utils_1.formatVietnamesePhoneNumber)(numberValue.toString());
                    const processedType = this.config.transformType
                        ? this.config.transformType(typeValue)
                        : typeValue;
                    // Classify the scam type
                    const classifiedType = (0, ScamType_1.classifyScamType)(processedType);
                    const typeDescription = (0, ScamType_1.getScamTypeDescription)(classifiedType);
                    // Count type statistics
                    if (typeStats[classifiedType]) {
                        typeStats[classifiedType]++;
                    }
                    else {
                        typeStats[classifiedType] = 1;
                    }
                    const cleanedRecord = {
                        number: formattedNumber,
                        type: processedType,
                        locker_type: classifiedType
                    };
                    records.push(cleanedRecord);
                })
                    .on('end', () => {
                    console.log(`Processed ${records.length} valid records from ${this.outputFileName}`);
                    console.log(`✅ Valid phone numbers: ${validPhoneCount}`);
                    console.log(`❌ Invalid/Short numbers (skipped): ${invalidPhoneCount}`);
                    console.log(`📊 Total rows skipped: ${skippedRows}`);
                    // Display type classification statistics
                    console.log(`\n📋 Type Classification Statistics:`);
                    Object.entries(typeStats)
                        .sort(([, a], [, b]) => b - a)
                        .forEach(([type, count]) => {
                        const description = (0, ScamType_1.getScamTypeDescription)(type);
                        console.log(`  ${type}: ${count} (${description})`);
                    });
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
                    { id: 'type', title: 'type' },
                    { id: 'locker_type', title: 'locker_type' }
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