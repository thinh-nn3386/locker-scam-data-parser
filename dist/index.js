"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Cleaner_1 = __importDefault(require("./Cleaner"));
// Main application entry point
class App {
    static async main() {
        console.log('🚀 Scam Data Cleaner Application');
        console.log('===================================');
        // Get command line arguments
        const args = process.argv.slice(2);
        try {
            if (args.length === 0) {
                // No arguments, run all files
                console.log('No arguments provided. Running all configured files...\n');
                await Cleaner_1.default.runAll();
                console.log('\n✅ All cleaning processes completed successfully');
            }
            else if (args[0] === '--all') {
                // Explicitly run all files
                console.log('Running all configured files...\n');
                await Cleaner_1.default.runAll();
                console.log('\n✅ All cleaning processes completed successfully');
            }
            else if (args[0] === '--multiple') {
                // Run multiple specific files
                const fileNames = args.slice(1);
                if (fileNames.length === 0) {
                    console.error('❌ Please provide file names after --multiple flag');
                    process.exit(1);
                }
                console.log(`Running multiple files: ${fileNames.join(', ')}\n`);
                await Cleaner_1.default.runMultiple(fileNames);
                console.log('\n✅ Multiple file cleaning processes completed successfully');
            }
            else {
                // Run single file
                const fileName = args[0];
                console.log(`Running single file: ${fileName}\n`);
                await Cleaner_1.default.run(fileName);
                console.log(`\n✅ Cleaning process for ${fileName} completed successfully`);
            }
        }
        catch (error) {
            console.error('❌ Cleaning process failed:', error);
            process.exit(1);
        }
    }
}
// Run the application
if (require.main === module) {
    App.main();
}
exports.default = App;
//# sourceMappingURL=index.js.map