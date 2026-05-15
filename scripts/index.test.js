// Mocking document and other globals before requiring index.js
global.document = {
    querySelector: jest.fn().mockReturnValue({}),
    getElementById: jest.fn(),
};

const { htmlModalContent } = require('./index.js');

describe('htmlModalContent', () => {
    test('should generate correct HTML with all fields provided', () => {
        // Use a timestamp that avoids timezone issues (middle of the day UTC)
        // 1672574400000 is 2023-01-01 12:00:00 UTC
        const mockData = {
            id: '1672574400000',
            url: 'https://example.com/image.png',
            title: 'Test Task',
            description: 'Test Description'
        };

        const result = htmlModalContent(mockData);
        const expectedDate = new Date(parseInt(mockData.id)).toDateString();

        expect(result).toContain(`id=${mockData.id}`);
        expect(result).toContain(`src=${mockData.url}`);
        expect(result).toContain(mockData.title);
        expect(result).toContain(mockData.description);
        expect(result).toContain(`Created on ${expectedDate}`);
        expect(result).toContain('showtaskimage');
    });

    test('should use default image when url is missing', () => {
        const mockData = {
            id: '1672574400000',
            url: '',
            title: 'Test Task',
            description: 'Test Description'
        };

        const result = htmlModalContent(mockData);

        expect(result).toContain('src="images/defaultimage.jpg"');
        expect(result).toContain('taskimage');
        expect(result).not.toContain('showtaskimage');
    });

    test('should handle undefined url correctly', () => {
        const mockData = {
            id: '1672574400000',
            title: 'Test Task',
            description: 'Test Description'
        };

        const result = htmlModalContent(mockData);

        expect(result).toContain('src="images/defaultimage.jpg"');
        expect(result).toContain('taskimage');
    });
});
