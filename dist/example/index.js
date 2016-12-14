// Create Parser object
var parser = new SVGParser.Parser();

// Register the onTag callback
parser.onTag(function(tag) {
    console.info('onTag:', tag);
});

// Load multiple files (sync)
function loadFiles(files) {
    var file = files.shift();

    console.groupCollapsed('open: ' + file.name);

    loadFile(file).then(function() {
        console.groupEnd();
        files.length && loadFiles(files);
    });
}

// Load one file
function loadFile(file) {
    console.groupCollapsed('loading');
    console.log('file:', file);

    // Load SVG from file
    return parser.loadFromFile(file).then(function(element) {
        console.log('element:', element);
        console.groupEnd();

        // Parse the file and return a promise
        console.groupCollapsed('parsing');
        return parser.parse().then(function(tags) {
            console.groupEnd();

            console.groupCollapsed('result');
            console.log('document:', parser.document);
            console.log('editor:', parser.editor);
            console.log('tags:', parser.tags);
            console.groupEnd();

            console.groupCollapsed('drawing');
            drawFile(file, tags);
            console.groupEnd();
        });
    })
    .catch(function(error) {
        console.groupEnd();
        console.error('error:', error);
    });

    // Same as above but shorter
    // return parser.parse(file).then(function(tags) {
    //     console.log('tags:', tags);
    // })
    // .catch(function(error) {
    //     console.error('error:', error);
    // });
}

// Draw ------------------------------------------------------------------------

function drawFile(file, tags) {
    // Flip Y coords and move UP by document height
    // (to set origin at bottom/left corners)
    tags.applyMatrix([1, 0, 0, -1, 0, parser.document.height]);

    // Draw and add the object
    addObject(file.name, drawTag(tags));
}

function drawTag(tag) {
    // Create 3D object
    var object = new THREE.Object3D();

    // Draw object paths if almost one is present
    if (tag.paths.length && tag.paths[0].length) {
        console.info('draw:', object, tag);

        tag.getShapes().forEach(function(shape) {
            object.add(drawShape(tag, shape));
        });

        tag.getPaths().forEach(function(path) {
            object.add(drawLine(tag, path));
        });
    }

    // Draw children
    tag.children.forEach(function(child) {
        object.add(drawTag(child));
    });

    // Return object
    return object;
}

function drawLine(tag, path) {
    console.log('line:', path);

    var geometry = new THREE.Geometry();
    var material = this.createLineMaterial(tag);

    path.points.forEach(function(point) {
        geometry.vertices.push(new THREE.Vector3(point.x, point.y, 0));
    });

    return new THREE.Line(geometry, material);
}

function createLineMaterial(tag) {
    return new THREE.LineBasicMaterial({ color: this.createColor(
        tag.getAttr('stroke', tag.getAttr('fill', 'black'))
    )});
}

function createSolidMaterial(tag) {
    var opacity  = tag.getAttr('fillOpacity', 1);
    var material = new THREE.MeshBasicMaterial({
        color: tag.getAttr('fill', 'black')
    });

    if (opacity < 1) {
        material.transparent = true;
        material.opacity     = opacity;
    }

    return material;
};

function drawShape(tag, path) {
    console.log('shape:', path);

    let shape = new THREE.Shape(path.outer.points);

    path.holes.forEach(function(hole) {
        shape.holes.push(new THREE.Path(hole.points));
    });

    var geometry = new THREE.ShapeGeometry(shape);
    var material = createSolidMaterial(tag);

    return new THREE.Mesh(geometry, material);
}

function createColor(color) {
    // TODO ...
    if (color === 'none') {
        color = 'black';
    }

    color = new THREE.Color(color);
    var r = color.r * 255;
    var g = color.g * 255;
    var b = color.b * 255;

    // Darken too light colors...
    var luma, lumaLimit = 200;

    while (true) {
        luma = (r * 0.3) + (g * 0.59) + (b * 0.11);

        if (luma <= lumaLimit) {
            break;
        }

        r > 0 && (r -= 1);
        g > 0 && (g -= 1);
        b > 0 && (b -= 1);
    }

    // Create color object ([0-255] to [0-1] range)
    color = new THREE.Color(r / 255, g / 255, b / 255);

    // Return the color object
    return color;
}

// UI --------------------------------------------------------------------------

var scene, width, height, renderer, canvas, camera, controls, mesh;

function initViewer() {
    scene    = new THREE.Scene();
    width    = window.innerWidth;
    height   = window.innerHeight;
    renderer = new THREE.WebGLRenderer();
    canvas   = renderer.domElement;
    camera   = new THREE.PerspectiveCamera(75, width / height, 1, 10000);
    controls = new THREE.OrbitControls(camera, canvas);

    renderer.setClearColor(0xffffff, 1);
    renderer.setSize(width, height);

    camera.position.z = 1000;

    controls.enableRotate = true;
    controls.enableZoom   = true;
    controls.enableKeys   = false;

    controls.target.set(0, 0, 0);

    document.body.appendChild(canvas);
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

function resize() {
    width  = window.innerWidth;
    height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
}

function addObject(name, object) {
    object.name = name;
    scene.add(object);
}

$(document).ready(function() {
    // On file input change
    $('#file').on('change', function(event) {
        var files = Array.prototype.slice.call(event.target.files);

        loadFiles(files);
        $(this).val(null);
    });

    // On window resize
    $(window).on('resize', resize)

    // Init viewer
    initViewer();
    animate();
});
