import { fileToBase64 } from './fileToBase64';

describe('fileToBase64 utility', () => {
    let originalFileReader: typeof FileReader;

    beforeAll(() => {
        originalFileReader = global.FileReader;
    });

    afterAll(() => {
        global.FileReader = originalFileReader;
    });

    test('should resolve with base64 string when file is read successfully', async () => {
        const file = new File(['content'], 'test.txt', { type: 'text/plain' });
        const mockResult = 'data:text/plain;base64,Y29udGVudA==';

        class MockFileReader {
            result = mockResult;
            onload: (() => void) | null = null;
            readAsDataURL() {
                setTimeout(() => {
                    if (this.onload) {
                        this.onload();
                    }
                }, 0);
            }
        }

        global.FileReader = MockFileReader as unknown as typeof FileReader;

        const result = await fileToBase64(file);
        expect(result).toBe(mockResult);
    });

    test('should reject with an error when file reading fails', async () => {
        const file = new File(['content'], 'test.txt', { type: 'text/plain' });
        const mockError = new Error('Read error');

        class MockFileReader {
            onerror: ((err: Error) => void) | null = null;
            readAsDataURL() {
                setTimeout(() => {
                    if (this.onerror) {
                        this.onerror(mockError);
                    }
                }, 0);
            }
        }

        global.FileReader = MockFileReader as unknown as typeof FileReader;

        await expect(fileToBase64(file)).rejects.toThrow('Read error');
    });
});
