import { Point } from './path'

const MATH_PI_2  = Math.PI * 2
const DEG_TO_RAD = Math.PI / 180

// Rewrite from https://github.com/MadLittleMods/svg-curve-lib/blob/master/src/js/svg-curve-lib.js#L84
class Arc {
    // Class constructor...
    constructor(settings) {
        this.init(settings)
    }

    // Init arc properties
    init(settings) {
        // Init properties
        this.p1    = settings.p1
        this.p2    = settings.p2
        this.rx    = settings.rx
        this.ry    = settings.ry
        this.angle = settings.angle
        this.large = settings.large
        this.sweep = settings.sweep

        this.points     = null
        this.radians    = null
        this.startAngle = null
        this.sweepAngle = null
        this.center     = null
    }

    mod(x, m) {
        return (x % m + m) % m
    }

    angleBetween(v0, v1) {
        let p = v0.x * v1.x + v0.y * v1.y
        let n = Math.sqrt((Math.pow(v0.x, 2) + Math.pow(v0.y, 2)) * (Math.pow(v1.x, 2) + Math.pow(v1.y, 2)))
        return (v0.x * v1.y - v0.y * v1.x < 0 ? -1 : 1) * Math.acos(p / n)
    }

    getPoint(t) {
        let angle = this.startAngle + (this.sweepAngle * t)

        let x = this.rx * Math.cos(angle)
        let y = this.ry * Math.sin(angle)

        return new Point(
            Math.cos(this.radians) * x - Math.sin(this.radians) * y + this.center.x,
            Math.sin(this.radians) * x + Math.cos(this.radians) * y + this.center.y
        )
    }

    _addPoint(point) {
        this.points.push(point.x, point.y)
    }

    trace() {
        // Reset points collection
        this.points = []

        // Get angle in radians
        this.radians = this.mod(this.angle, 360) * DEG_TO_RAD

        // If the endpoints are identical, then this is equivalent
        // to omitting the elliptical arc segment entirely.
        if(this.p1.x === this.p2.x && this.p1.y === this.p2.y) {
            return this.points
        }

        this.rx = Math.abs(this.rx)
        this.ry = Math.abs(this.ry)

        // If rx = 0 or ry = 0 then this arc is treated as
        // a straight line segment joining the endpoints.
        if (this.rx === 0 || this.ry === 0) {
            this._addPoint(this.p1)
            this._addPoint(this.p2)
            return this.points
        }

        // Following "Conversion from endpoint to center parameterization"
        // http://www.w3.org/TR/SVG/implnote.html#ArcConversionEndpointToCenter

        // Step #1: Compute transformedPoint
        let dx = (this.p1.x - this.p2.x) / 2
        let dy = (this.p1.y - this.p2.y) / 2

        let transformedPoint = {
            x:  Math.cos(this.radians) * dx + Math.sin(this.radians) * dy,
            y: -Math.sin(this.radians) * dx + Math.cos(this.radians) * dy
        }

        // Ensure radii are large enough
        let radiiCheck = Math.pow(transformedPoint.x, 2) / Math.pow(this.rx, 2) + Math.pow(transformedPoint.y, 2) / Math.pow(this.ry, 2)

        if (radiiCheck > 1) {
            this.rx = Math.sqrt(radiiCheck) * this.rx
            this.ry = Math.sqrt(radiiCheck) * this.ry
        }

        // Step #2: Compute transformedCenter
        let cSquareNumerator = Math.pow(this.rx, 2) * Math.pow(this.ry, 2) - Math.pow(this.rx, 2) * Math.pow(transformedPoint.y, 2) - Math.pow(this.ry, 2) * Math.pow(transformedPoint.x, 2)
        let cSquareRootDenom = Math.pow(this.rx, 2) * Math.pow(transformedPoint.y, 2) + Math.pow(this.ry, 2) * Math.pow(transformedPoint.x, 2)
        let cRadicand        = cSquareNumerator / cSquareRootDenom

        // Make sure this never drops below zero because of precision
        cRadicand = cRadicand < 0 ? 0 : cRadicand
        let cCoef = (this.large !== this.sweep ? 1 : -1) * Math.sqrt(cRadicand)
        let transformedCenter = {
            x: cCoef * ( (this.rx * transformedPoint.y) / this.ry),
            y: cCoef * (-(this.ry * transformedPoint.x) / this.rx)
        }

        // Step #3: Compute center
        this.center = {
            x: Math.cos(this.radians) * transformedCenter.x - Math.sin(this.radians) * transformedCenter.y + ((this.p1.x + this.p2.x) / 2),
            y: Math.sin(this.radians) * transformedCenter.x + Math.cos(this.radians) * transformedCenter.y + ((this.p1.y + this.p2.y) / 2)
        }

        // Step #4: Compute start/sweep angles
        // Start angle of the elliptical arc prior to the stretch and rotate operations.
        // Difference between the start and end angles
        let startVector = {
            x: (transformedPoint.x - transformedCenter.x) / this.rx,
            y: (transformedPoint.y - transformedCenter.y) / this.ry
        }

        let endVector = {
            x: (-transformedPoint.x - transformedCenter.x) / this.rx,
            y: (-transformedPoint.y - transformedCenter.y) / this.ry
        }

        this.startAngle = this.angleBetween({ x: 1, y: 0 }, startVector)
        this.sweepAngle = this.angleBetween(startVector, endVector)

        if (! this.sweep && this.sweepAngle > 0) {
            this.sweepAngle -= MATH_PI_2
        }

        else if (this.sweep && this.sweepAngle < 0) {
            this.sweepAngle += MATH_PI_2
        }

        // We use % instead of `mod(..)` because we want it to be -360deg to 360deg(but actually in radians)
        this.sweepAngle %= MATH_PI_2

        for (let t = 0; t <= 1; t += 0.01) {
            this._addPoint(this.getPoint(t))
        }

        // Push last point
        this._addPoint(this.p2)

        // Return the points collection
        return this.points
    }
}

// Exports
export { Arc }
