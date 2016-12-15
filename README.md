# lw.svg-parser ([demo](https://lautr3k.github.io/lw.svg-parser/dist/example/))
SVG parser for [LaserWeb/CNCWeb](https://github.com/LaserWeb/LaserWeb4).

## Supported tags
```html
<svg>
<title> <desc>
<g> <defs> <use>
<line> <polyline> <polygon>
<rect> <circle> <ellipse>
<path>
```

## Features
- ViewBox, PreserveAspectRatio
- Clipping paths with [Clipper.js](https://sourceforge.net/projects/jsclipper/)
- Promise mechanism

## Settings (all are optional)
```javascript
{
  includes: ['svg', 'g', 'defs', 'use', 'line', 'polyline', 'polygon', 'rect', 'circle', 'ellipse', 'path', 'title', 'desc'],
  excludes: ['#text', '#comment'],
  traceSettings: { // Arc, Bezier curves only
    linear       : true, // Linear trace mode
    step         : 0.01, // Step resolution if linear mode = false
    resolution   : 100,  // Number of segments we use to approximate arc length
    segmentLength: 1     // Segment length
  },
  onTag: tag => {} // Called after a tag is parsed
}
```

## Usages
```javascript
import Parser from 'svg-parser'

let parser = new Parser(settings)

// <input> must be an raw XML string, XMLDocument, Element or File object
return parser.parse(input).then(tags => {
    console.log('tags:', tags);
})
.catch(error => {
    console.error('error:', error);
});
```
