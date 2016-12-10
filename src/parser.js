// Imports
import './tag'

// SVG parser class
export class Parser {
    // Class constructor...
    constructor(settings) {
        // Defaults settings
        settings = settings || {}

        // Init properties
        this.element  = null // XML document Element object
        this.editor   = null // Editor info { name, version, fingerprint }
        this.document = null // Document info { width, height, viewBox }
        this.defs     = null // Defined <defs> (DOM) nodes list by id
        this.tags     = null // Tag objects hierarchy
        this.tag      = null // Current Tag object

        // Supported tags by this lib
        this.supportedTags = [
            'svg', 'g', 'defs', 'use',
            'line', 'polyline', 'polygon',
            'rect', 'circle', 'ellipse', 'path'
        ]

        // Tags list to parse
        this.parseTags = settings.includes || this.supportedTags
    }

    // Load raw XML string, XMLDocument, Element or File object
    load(input) {
        // Load raw XML string
        if (typeof input === 'string') {
            return this.loadFromString(input)
        }

        // Load File object
        if (input instanceof File) {
            return this.loadFromFile(input)
        }

        // Load XMLDocument object
        if (input instanceof XMLDocument) {
            return this.loadFromXMLDocument(input)
        }

        // Load Element object
        if (input instanceof Element) {
            return this.loadFromElement(input)
        }

        // Return rejected promise with an Error object
        return Promise.reject(new Error('Unsupported input format.'))
    }

    // Load from Element object
    loadFromElement(input) {
        return new Promise((resolve, reject) => {
            // Bad input type
            if (! (input instanceof Element)) {
                return reject(new Error('Input param must be a Element object.'))
            }

            // Parser error
            if (input.nodeName === 'parsererror') { // FF
                return reject(new Error(input.textContent))
            }

            if (input.nodeName === 'html' && input.getElementsByTagName('parsererror')) { // Chrome
                return reject(new Error(input.getElementsByTagName('parsererror')[0].textContent))
            }

            // Set document element
            this.element = input

            // Resolve promise
            resolve(input)
        })
    }

    // Load from XMLDocument object
    loadFromXMLDocument(input) {
        return new Promise((resolve, reject) => {
            // Bad input type
            if (! (input instanceof XMLDocument)) {
                return reject(new Error('Input param must be a XMLDocument object.'))
            }

            // Load from Element...
            this.loadFromElement(input.documentElement).then(resolve).catch(reject)
        })
    }

    // Load raw XML string
    loadFromString(input) {
        return new Promise((resolve, reject) => {
            // Bad input type
            if (typeof input !== 'string') {
                return reject(new Error('Input param must be a string.'))
            }

            // Parse string as DOM object
            let parser = new DOMParser()
            let XMLDoc = parser.parseFromString(input, 'text/xml')

            // Load from XMLDocument...
            this.loadFromXMLDocument(XMLDoc).then(resolve).catch(reject)
        })
    }

    // Load from File object
    loadFromFile(input) {
        return new Promise((resolve, reject) => {
            // Bad input type
            if (! (input instanceof File)) {
                return reject(new Error('Input param must be a File object.'))
            }

            // Create file reader
            var reader = new FileReader()

            // Register reader events handlers
            reader.onload = event => {
                this.loadFromString(event.target.result).then(resolve).catch(reject)
            }

            reader.onerror = event => {
                reject(new Error('Error reading file : ' + input.name))
            }

            // Finally read input file as text
            reader.readAsText(input)
        })
    }
}

// Exports default
export default Parser
