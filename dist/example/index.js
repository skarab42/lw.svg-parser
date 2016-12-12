// Create Parser object
var parser = new SVGParser.Parser();

// Register the onTag callback
parser.onTag(function(tag) {
    console.info('onTag:', tag);
});

// Load the provided file
function loadFile(file) {
    console.log('loadFile:', file);

    // Load SVG from file
    parser.loadFromFile(file).then(function(element) {
        console.log('element:', element);

        // Parse the file and return a promise
        return parser.parse().then(function(tags) {
            console.log('tags:', tags);
            console.log('parser:', parser);
        });
    })
    .catch(function(error) {
        console.error('error:', error);
    });

    // Same as above but shorter
    // parser.parse(file).then(function(tags) {
    //     console.log('tags:', tags);
    // })
    // .catch(function(error) {
    //     console.error('error:', error);
    // });
}

// On file input change
$('#file').on('change', function(event) {
    var files = event.target.files;

    for (var i = 0, il = files.length; i < il; i++) {
        loadFile(files[i]);
    }

    $(this).val(null);
});
