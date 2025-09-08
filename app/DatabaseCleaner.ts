import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { Database } from 'sqlite3';
import { validateVietnamesePhoneNumber, formatVietnamesePhoneNumber } from './utils';
import { classifyScamType, getScamTypeDescription, ScamPhoneType } from './ScamType';

const createCsvWriter = require('csv-writer').createObjectCsvWriter;

interface DatabaseRecord {
  number: string;
  type: string;
}

interface OutputRecord {
  number: string;
  type: string;
  locker_type: string;
}

interface DatabaseConfig {
  dbPath: string;
  tableName: string;
  numberField: string;
  typeField: string;
  outputFileName: string;
}

const DATABASE_CONFIGS: Record<string, DatabaseConfig> = {
  'sorac': {
    dbPath: 'sorac.db',
    tableName: 'User',
    numberField: 'number',
    typeField: 'fullName',
    outputFileName: 'sorac_clean.csv'
  },
  'ntrust': {
    dbPath: 'ntrust.db',
    tableName: 'phone_number',
    numberField: 'dial_id',
    typeField: 'type_tag',
    outputFileName: 'ntrust_clean.csv'
  },
  'cleancall': {
    dbPath: 'cleancall.db',
    tableName: 'identifications',
    numberField: 'phone_number',
    typeField: 'name',
    outputFileName: 'cleancall_clean.csv'
  }
};

class DatabaseCleaner {
  private config: DatabaseConfig;
  private outputDir: string;

  constructor(databaseName: string) {
    this.config = DATABASE_CONFIGS[databaseName];
    if (!this.config) {
      throw new Error(`No configuration found for database: ${databaseName}. Available: ${Object.keys(DATABASE_CONFIGS).join(', ')}`);
    }
    
    this.outputDir = join(process.cwd(), 'clean-data');
  }

  private async readDatabaseRecords(): Promise<DatabaseRecord[]> {
    return new Promise((resolve, reject) => {
      const dbPath = join(process.cwd(), 'data', this.config.dbPath);
      
      if (!existsSync(dbPath)) {
        reject(new Error(`Database file not found: ${dbPath}`));
        return;
      }

      const db = new Database(dbPath, (err) => {
        if (err) {
          reject(new Error(`Failed to open database: ${err.message}`));
          return;
        }
      });

      const query = `SELECT ${this.config.numberField}, ${this.config.typeField} FROM ${this.config.tableName}`;
      const records: DatabaseRecord[] = [];

      db.all(query, [], (err, rows: any[]) => {
        if (err) {
          db.close();
          reject(new Error(`Failed to query database: ${err.message}`));
          return;
        }

        rows.forEach(row => {
          const number = row[this.config.numberField];
          const type = row[this.config.typeField];
          
          if (number) { // Only include records with valid numbers
            records.push({
              number: String(number),
              type: type || 'unknown'
            });
          }
        });

        db.close((err) => {
          if (err) {
            console.warn(`Warning: Failed to close database: ${err.message}`);
          }
        });

        resolve(records);
      });
    });
  }

  async cleanData(): Promise<void> {
    try {
      console.log(`🔍 Processing database: ${this.config.dbPath}`);
      
      // Ensure output directory exists
      if (!existsSync(this.outputDir)) {
        mkdirSync(this.outputDir, { recursive: true });
      }

      // Read records from database
      const inputRecords = await this.readDatabaseRecords();
      console.log(`📖 Found ${inputRecords.length} records in database`);

      const outputRecords: OutputRecord[] = [];
      let validPhoneCount = 0;
      let invalidPhoneCount = 0;
      const typeStats: Record<string, number> = {};

      // Process each record
      for (const record of inputRecords) {
        // Clean and validate phone number
        const cleanedNumber = formatVietnamesePhoneNumber(record.number);
        
        if (!validateVietnamesePhoneNumber(cleanedNumber)) {
          invalidPhoneCount++;
          continue;
        }

        validPhoneCount++;

        // Classify scam type
        const scamType = classifyScamType(record.type);
        const lockerType = getScamTypeDescription(scamType);

        // Update statistics
        typeStats[lockerType] = (typeStats[lockerType] || 0) + 1;

        outputRecords.push({
          number: cleanedNumber,
          type: record.type,
          locker_type: lockerType
        });
      }

      // Write to CSV
      const outputFilePath = join(this.outputDir, this.config.outputFileName);
      const csvWriter = createCsvWriter({
        path: outputFilePath,
        header: [
          { id: 'number', title: 'number' },
          { id: 'type', title: 'type' },
          { id: 'locker_type', title: 'locker_type' }
        ]
      });

      await csvWriter.writeRecords(outputRecords);

      // Print summary
      console.log(`\n📊 Processing Summary for ${this.config.dbPath}:`);
      console.log(`   📱 Total records processed: ${inputRecords.length}`);
      console.log(`   ✅ Valid phone numbers: ${validPhoneCount}`);
      console.log(`   ❌ Invalid phone numbers: ${invalidPhoneCount}`);
      console.log(`   📁 Output file: ${this.config.outputFileName}`);
      
      console.log(`\n📈 Type Distribution:`);
      Object.entries(typeStats)
        .sort(([,a], [,b]) => b - a)
        .forEach(([type, count]) => {
          const percentage = ((count / validPhoneCount) * 100).toFixed(1);
          console.log(`   ${type}: ${count} (${percentage}%)`);
        });

    } catch (error) {
      console.error(`❌ Error processing ${this.config.dbPath}:`, error);
      throw error;
    }
  }

  // Method to run the cleaning process for a single database
  static async run(databaseName: string): Promise<void> {
    const cleaner = new DatabaseCleaner(databaseName);
    await cleaner.cleanData();
  }

  // Method to run the cleaning process for multiple databases
  static async runMultiple(databaseNames: string[]): Promise<void> {
    console.log(`🚀 Starting batch processing for ${databaseNames.length} databases...`);
    
    for (const dbName of databaseNames) {
      try {
        console.log(`\n${'='.repeat(50)}`);
        await DatabaseCleaner.run(dbName);
      } catch (error) {
        console.error(`❌ Failed to process database ${dbName}:`, error);
      }
    }
  }

  // Method to run all configured databases
  static async runAll(): Promise<void> {
    const allDatabases = Object.keys(DATABASE_CONFIGS);
    console.log(`🎯 Running all configured databases: ${allDatabases.join(', ')}`);
    await DatabaseCleaner.runMultiple(allDatabases);
  }

  // Static method to list available databases
  static listAvailableDatabases(): string[] {
    return Object.keys(DATABASE_CONFIGS);
  }
}

export default DatabaseCleaner;
