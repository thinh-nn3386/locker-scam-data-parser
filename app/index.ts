import DatabaseCleaner from './DatabaseCleaner';

// Main application entry point
class App {
  static async main(): Promise<void> {
    console.log('🚀 Scam Data Cleaner Application');
    console.log('===================================');
    
    // Get command line arguments
    const args = process.argv.slice(2);
    
    try {
      if (args.length === 0) {
        // No arguments, run all databases
        console.log('No arguments provided. Running all configured databases...\n');
        await DatabaseCleaner.runAll();
        console.log('\n✅ All database cleaning processes completed successfully');
      } else if (args[0] === '--db' || args[0] === '--database') {
        // Run database cleaner
        const dbArgs = args.slice(1);
        if (dbArgs.length === 0 || dbArgs[0] === '--all') {
          console.log('Running all configured databases...\n');
          await DatabaseCleaner.runAll();
        } else if (dbArgs[0] === '--multiple') {
          const dbNames = dbArgs.slice(1);
          if (dbNames.length === 0) {
            console.error('❌ Please provide database names after --multiple flag');
            console.log(`Available databases: ${DatabaseCleaner.listAvailableDatabases().join(', ')}`);
            process.exit(1);
          }
          await DatabaseCleaner.runMultiple(dbNames);
        } else if (dbArgs[0] === '--list') {
          console.log(`Available databases: ${DatabaseCleaner.listAvailableDatabases().join(', ')}`);
          return;
        } else {
          const dbName = dbArgs[0];
          console.log(`Running single database: ${dbName}\n`);
          await DatabaseCleaner.run(dbName);
        }
        console.log('\n✅ Database cleaning processes completed successfully');
      } else if (args[0] === '--all') {
        // Run all databases
        console.log('Running all configured databases...\n');
        await DatabaseCleaner.runAll();
        console.log('\n✅ All cleaning processes completed successfully');
      } else if (args[0] === '--help' || args[0] === '-h') {
        console.log('Usage:');
        console.log('  npm start                    # Run all databases (default)');
        console.log('  npm start -- --db --all     # Run all databases');
        console.log('  npm start -- --db sorac     # Run specific database');
        console.log('  npm start -- --db --multiple sorac ntrust  # Run multiple databases');
        console.log('  npm start -- --db --list    # List available databases');
        console.log('  npm start -- --all          # Run all databases');
        console.log('  npm start -- --help         # Show this help');
        return;
      } else {
        // Default: treat as database name
        const dbName = args[0];
        console.log(`Running database: ${dbName}\n`);
        await DatabaseCleaner.run(dbName);
        console.log(`\n✅ Cleaning process for ${dbName} completed successfully`);
      }
    } catch (error) {
      console.error('❌ Cleaning process failed:', error);
      process.exit(1);
    }
  }
}

// Run the application
if (require.main === module) {
  App.main();
}

export default App;
