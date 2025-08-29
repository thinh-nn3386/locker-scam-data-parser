# 🛡️ Scam Data Cleaner

A powerful TypeScript application for cleaning and standardizing CSV files containing scam/spam phone number data. This tool converts various CSV formats into a unified structure with `(number, type)` columns.

## 📋 Table of Contents

- [Features](#features)
- [Supported File Formats](#supported-file-formats)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Development](#development)
- [Examples](#examples)

## ✨ Features

- **Multi-format Support**: Handles different CSV structures automatically
- **Batch Processing**: Process multiple files simultaneously
- **Type Safety**: Built with TypeScript for reliability
- **Flexible Configuration**: Easy to add new file formats
- **Error Handling**: Continues processing even if individual files fail
- **Clean Output**: Standardized `(number, type)` format for all outputs

## 📊 Supported File Formats

The application currently supports these CSV file formats:

| File | Input Columns | Number Field | Type Field | Records |
|------|---------------|--------------|------------|---------|
| `sola.csv` | id, number, fullName | number | fullName | ~61K |
| `CleanCall.csv` | id, name, phone_number, total_report | phone_number | name | ~67K |
| `ntrust_part1.csv` | dial_id, type_tag, ... | dial_id | type_tag | ~119K |
| `ntrust_part2.csv` | dial_id, type_tag, ... | dial_id | type_tag | ~118K |
| `ntrust_part3.csv` | dial_id, type_tag, ... | dial_id | type_tag | ~11K |

## 🚀 Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Setup

1. **Clone or navigate to the project directory:**
   ```bash
   cd /path/to/scam-data
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Build the project:**
   ```bash
   npm run build
   ```

## 💻 Usage

### Quick Start

```bash
# Process all configured files
npm start

# Or explicitly run all files
npm run clean:all
```

### Individual Files

```bash
# Process specific files
npm run clean:sola          # Only sola.csv
npm run clean:cleancall     # Only CleanCall.csv
npm run clean:ntrust        # All ntrust files (part1, part2, part3)
```

### Command Line Options

```bash
# Build and run with specific options
npm run build

# Run all files
node dist/index.js --all

# Run specific file
node dist/index.js sola.csv

# Run multiple specific files
node dist/index.js --multiple ntrust_part1.csv ntrust_part2.csv
```

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run build` | Compile TypeScript to JavaScript |
| `npm start` | Run the application (processes all files) |
| `npm run clean:all` | Build and process all files |
| `npm run clean:sola` | Build and process sola.csv |
| `npm run clean:cleancall` | Build and process CleanCall.csv |
| `npm run clean:ntrust` | Build and process all ntrust files |

## 📁 Project Structure

```
scam-data/
├── app/
│   ├── Cleaner.ts          # Core cleaning logic
│   └── index.ts            # Main application entry point
├── data/                   # Input CSV files
│   ├── sola.csv
│   ├── CleanCall.csv
│   ├── ntrust_part1.csv
│   ├── ntrust_part2.csv
│   └── ntrust_part3.csv
├── clean-data/             # Output directory (auto-created)
│   ├── sola.csv
│   ├── CleanCall.csv
│   ├── ntrust_part1.csv
│   ├── ntrust_part2.csv
│   └── ntrust_part3.csv
├── dist/                   # Compiled JavaScript (auto-generated)
├── package.json
├── tsconfig.json
└── README.md
```

## ⚙️ Configuration

The application uses a configuration object in `app/Cleaner.ts` to map different file formats:

```typescript
const FILE_CONFIGS: Record<string, FileConfig> = {
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
  }
  // ... more configurations
};
```

### Adding New File Types

To add support for a new CSV format:

1. Add a new entry to `FILE_CONFIGS` in `app/Cleaner.ts`
2. Specify the `numberField` and `typeField` for your CSV
3. Optionally add a `transformType` function for data transformation
4. Add the file to your `data/` directory
5. Rebuild and run!

## 🛠️ Development

### Building

```bash
npm run build
```

### Running in Development

```bash
# Build and run
npm run build && npm start

# Or run specific files for testing
npm run build && node dist/index.js sola.csv
```

### TypeScript Configuration

The project uses TypeScript with strict mode enabled. Configuration is in `tsconfig.json`:

- **Source**: `app/` directory
- **Output**: `dist/` directory
- **Target**: ES2020
- **Module**: CommonJS

## 📝 Examples

### Input File (sola.csv)
```csv
id,number,fullName
1,84996446203,Spam - khách sạn nghỉ dưỡng
2,84996446207,Spam - nhà hát
3,84996446406,Spam
```

### Output File (clean-data/sola.csv)
```csv
number,type
84996446203,Spam - khách sạn nghỉ dưỡng
84996446207,Spam - nhà hát
84996446406,Spam
```

### Sample Output

```bash
🚀 Scam Data Cleaner Application
===================================
Starting batch processing for 5 files...

--- Processing sola.csv ---
Processed 61355 records from sola.csv
Cleaned data saved to: /path/to/clean-data/sola.csv
Total records: 61355

--- Processing CleanCall.csv ---
Processed 67653 records from CleanCall.csv
Cleaned data saved to: /path/to/clean-data/CleanCall.csv
Total records: 67653

--- Batch processing completed ---
✅ All cleaning processes completed successfully
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is for internal use. Please ensure compliance with data privacy regulations when handling phone number data.

## 🐛 Troubleshooting

### Common Issues

1. **File not found errors**: Ensure your CSV files are in the `data/` directory
2. **Permission errors**: Check write permissions for the `clean-data/` directory
3. **Memory issues**: For very large files, consider processing them individually
4. **Build errors**: Run `npm install` to ensure all dependencies are installed

### Getting Help

- Check the console output for detailed error messages
- Ensure your CSV files match the expected format
- Verify that the file names match exactly (case-sensitive)

---

**Last Updated**: August 29, 2025  
**Version**: 1.0.0
