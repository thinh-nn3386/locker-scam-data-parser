declare class Cleaner {
    private inputFilePath;
    private outputDir;
    private outputFileName;
    private config;
    constructor(inputFileName?: string);
    cleanData(): Promise<void>;
    static run(inputFileName?: string): Promise<void>;
    static runMultiple(fileNames: string[]): Promise<void>;
    static runAll(): Promise<void>;
}
export default Cleaner;
//# sourceMappingURL=Cleaner.d.ts.map