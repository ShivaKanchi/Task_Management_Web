// Mocking DOM elements used in index.js to prevent errors during module import
const mockElement = {
    insertAdjacentHTML: jest.fn(),
    appendChild: jest.fn(),
    removeChild: jest.fn(),
    addEventListener: jest.fn(),
    setAttribute: jest.fn(),
    removeAttribute: jest.fn(),
    firstChild: null,
    childNodes: [],
    parentNode: {
        removeChild: jest.fn()
    },
    value: ""
};

global.document = {
    querySelector: jest.fn().mockReturnValue(mockElement),
    getElementById: jest.fn().mockReturnValue(mockElement),
};

global.localStorage = {
    setItem: jest.fn(),
    getItem: jest.fn(),
    tasks: undefined
};

global.alert = jest.fn();

const { htmlTaskContent } = require('./index');

describe('htmlTaskContent', () => {
    const taskData = {
        id: '12345',
        key: '12345',
        url: 'https://example.com/image.jpg',
        title: 'Test Task',
        tags: 'test,jest',
        description: 'This is a test description'
    };

    test('should render task card with all fields', () => {
        const result = htmlTaskContent(taskData);

        // Using regex for more flexible matching of attributes
        expect(result).toMatch(/id=12345/);
        expect(result).toMatch(/key=12345/);
        expect(result).toMatch(/src=https:\/\/example\.com\/image\.jpg/);
        expect(result).toContain('Test Task');
        expect(result).toContain('test,jest');
        expect(result).toContain('This is a test description');
    });

    test('should render default image if url is missing', () => {
        const dataWithoutUrl = { ...taskData, url: '' };
        const result = htmlTaskContent(dataWithoutUrl);

        // Specifically check for the default image path
        expect(result).toContain('src="images/defaultimage.jpg"');
    });

    test('should handle undefined url and show default image', () => {
        const dataWithUndefinedUrl = { ...taskData, url: undefined };
        const result = htmlTaskContent(dataWithUndefinedUrl);

        expect(result).toContain('src="images/defaultimage.jpg"');
    });

    test('should render empty fields correctly', () => {
        const emptyData = {
            id: '000',
            key: '000',
            url: '',
            title: '',
            tags: '',
            description: ''
        };
        const result = htmlTaskContent(emptyData);

        expect(result).toMatch(/id=000/);
        expect(result).toContain('src="images/defaultimage.jpg"');
        expect(result).toContain('<h4 class="task__card_title"></h4>');
        expect(result).toContain('<p class="description trim-3-lines text-muted" data-gram_editors="false"></p>');
        expect(result).toContain('<span class="badge bg-primary m-1"></span>');
    });
});
