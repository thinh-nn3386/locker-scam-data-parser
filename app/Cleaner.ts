import { createReadStream, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import csv from 'csv-parser';
import { validateVietnamesePhoneNumber, formatVietnamesePhoneNumber } from './utils';
import { classifyScamType, getScamTypeDescription, ScamPhoneType } from './ScamType';
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

interface SolaRecord {
  id: string;
  number: string;
  fullName: string;
}

interface CleanCallRecord {
  id: string;
  name: string;
  phone_number: string;
  total_report: string;
}

interface NtrustRecord {
  id: string;
  dial_id: string;
  create_at: string;
  name: string;
  contact_type: string;
  type_tag: string;
  relation_type: string;
  dial_code: string;
  part_id: string;
  id_int: string;
}

interface OutputRecord {
  number: string;
  type: string;
  locker_type: string;
}

type InputRecord = SolaRecord | CleanCallRecord | NtrustRecord;

interface FileConfig {
  numberField: string;
  typeField: string;
  transformType?: (value: string) => string;
}

const FILE_CONFIGS: Record<string, FileConfig> = {
  'sola.csv': {
    numberField: 'number',
    typeField: 'fullName'
  },
  'clean_call.csv': {
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
  private inputFilePath: string;
  private outputDir: string;
  private outputFileName: string;
  private config: FileConfig;

  constructor(inputFileName: string = 'sola.csv') {
    // Use process.cwd() to get the current working directory instead of __dirname
    this.inputFilePath = join(process.cwd(), 'data', inputFileName);
    this.outputDir = join(process.cwd(), 'clean-data');
    this.outputFileName = inputFileName;
    
    // Get configuration for this file type
    this.config = FILE_CONFIGS[inputFileName];
    if (!this.config) {
      throw new Error(`No configuration found for file: ${inputFileName}`);
    }
  }

  async cleanData(): Promise<void> {
    try {
      // Ensure output directory exists
      if (!existsSync(this.outputDir)) {
        mkdirSync(this.outputDir, { recursive: true });
      }

      const outputFilePath = join(this.outputDir, this.outputFileName);
      const records: OutputRecord[] = [];
      let validPhoneCount = 0;
      let invalidPhoneCount = 0;
      let skippedRows = 0;
      
      // Statistics for type classification
      const typeStats: Record<string, number> = {};

      // Read and process CSV
      await new Promise<void>((resolve, reject) => {
        createReadStream(this.inputFilePath)
          .pipe(csv())
          .on('data', (row: any) => {
            // Use dynamic field mapping based on configuration
            const numberValue = row[this.config.numberField];
            const typeValue = row[this.config.typeField];
            
            // Skip rows with missing required fields
            if (!numberValue || !typeValue) {
              skippedRows++;
              return;
            }

            // Validate phone number first
            const isValidPhone = validateVietnamesePhoneNumber(numberValue.toString());
            
            // Skip invalid phone numbers entirely
            if (!isValidPhone) {
              invalidPhoneCount++;
              skippedRows++;
              return;
            }

            // Only process valid phone numbers
            validPhoneCount++;
            const formattedNumber = formatVietnamesePhoneNumber(numberValue.toString());
            
            const processedType = this.config.transformType 
              ? this.config.transformType(typeValue) 
              : typeValue;

            // Classify the scam type
            const classifiedType = classifyScamType(processedType);
            const typeDescription = getScamTypeDescription(classifiedType);
            
            // Count type statistics
            if (typeStats[classifiedType]) {
              typeStats[classifiedType]++;
            } else {
              typeStats[classifiedType] = 1;
            }

            const cleanedRecord: OutputRecord = {
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
              .sort(([,a], [,b]) => b - a)
              .forEach(([type, count]) => {
                const description = getScamTypeDescription(type as ScamPhoneType);
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

    } catch (error) {
      console.error('Error processing CSV:', error);
      throw error;
    }
  }

  // Method to run the cleaning process for a single file
  static async run(inputFileName?: string): Promise<void> {
    const cleaner = new Cleaner(inputFileName);
    await cleaner.cleanData();
  }

  // Method to run the cleaning process for multiple files
  static async runMultiple(fileNames: string[]): Promise<void> {
    console.log(`Starting batch processing for ${fileNames.length} files...`);
    
    for (const fileName of fileNames) {
      try {
        console.log(`\n--- Processing ${fileName} ---`);
        await Cleaner.run(fileName);
      } catch (error) {
        console.error(`Error processing ${fileName}:`, error);
        // Continue with other files even if one fails
      }
    }
    
    console.log('\n--- Batch processing completed ---');
  }

  // Method to run all configured files
  static async runAll(): Promise<void> {
    const allFiles = Object.keys(FILE_CONFIGS);
    await Cleaner.runMultiple(allFiles);
  }
}

export default Cleaner;
