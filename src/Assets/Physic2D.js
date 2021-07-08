export class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    static sum = l => {
        let x = 0;
        let y = 0;
        l.forEach(v => {
            x += v.x;
            y += v.y;
        });
        return new Vector(x, y);
    }

    static avg = l => {
        return Vector.sum(l).mul(1 / l.length);
    }

    static dif = (v1, v2) => {
        return new Vector(v2.x - v1.x, v2.y - v1.y);
    }

    static dist = (v1, v2) => {
        return Vector.dif(v1, v2).size();
    }

    static innerProd = (v1, v2) => {
        return v1.x * v2.x + v1.y * v2.y;
    }

    static outerProd = (v1, v2) => {
        return v1.x * v2.y - v1.y * v2.x;
    }

    move = v => {
        this.x += v.x;
        this.y += v.y;
    }

    add = v => {
        return new Vector(this.x + v.x, this.y + v.y);
    }

    sub = v => {
        return new Vector(this.x - v.x, this.y - v.y);
    }

    mul = c => {
        return new Vector(this.x * c, this.y * c);
    }

    rot = angle => {
        let cos = Math.cos(angle);
        let sin = Math.sin(angle);
        return new Vector(cos * this.x - sin * this.y, sin * this.x + cos * this.y);
    }

    dir = (size) => {
        let s = this.size();
        if(s === 0) return new Vector(0, size || 1);
        return this.mul((size || 1) / s);
    }

    size = () => {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    angle = () => {
        return Math.atan2(this.y, this.x);
    }

    copy = () => {
        return new Vector(this.x, this.y);
    }
}

export class Line {
    constructor(x1, y1, x2, y2) {
        this.p1 = new Vector(x1, y1);
        this.p2 = new Vector(x2, y2);
        this.d = Vector.dif(this.p1, this.p2);
        this.a = this.d.x === 0 ? null : (this.d.y / this.d.x);
        this.b = this.d.x === 0 ? null : (y1 - this.a * x1);
    }

    static intersection = (l1, l2) => {
        if(l1.a === l2.a) {
            return null;
        }
        else if(l1.a === null) {
            let x = l1.p1.x;
            let y = l2.a * x + l2.b;
            return new Vector(x, y);
        }
        else if(l2.a === null) {
            let x = l2.p1.x;
            let y = l1.a * x + l1.b;
            return new Vector(x, y);
        }
        let x = (l2.b - l1.b) / (l1.a - l2.a);
        let y = l1.a * x + l1.b;
        return new Vector(x, y);
    }

    center = () => {
        return Vector.avg([this.p1, this.p2]);
    }

    length = () => {
        return this.d.size();
    }

    angle = () => {
        return this.d.angle();
    }

    dir = (size) => {
        return this.d.mul((size || 1) / this.length());
    }

    parallelTranslation = v => {
        let p1 = this.p1.add(v);
        let p2 = this.p2.add(v);
        return new Line(p1.x, p1.y, p2.x, p2.y);
    }

    copy = () => {
        return new Line(this.p1.x, this.p1.y, this.p2.x, this.p2.y);
    }
}

export class FixedSpring {
    constructor(fixedPos, object, k, b) {
        this.fixedPos = fixedPos;
        this.object = object;
        this.k = k;
        this.b = b;
        this.initDist = Vector.dist(fixedPos, object.p);
    }

    force = () => {
        let dif = Vector.dif(this.fixedPos, this.object.p);
        let x = dif.size() - this.initDist;
        let v = this.object.v.size();
        let f = dif.dir(-this.k * x - this.b * v);
        this.object.force(f);
    }
}

export class Mass {
    constructor(x, y, vx, vy, m) {
        this.p = new Vector(x, y);
        this.v = new Vector(vx, vy);
        this.a = new Vector(0, 0);
        this.m = m;
    }

    force = f => {
        this.a.move(f.mul(1 / this.m));
    }

    move = dt => {
        this.v.move(this.a.mul(dt));
        this.p.move(this.v.mul(dt));
        this.a.x = 0;
        this.a.y = 0;
    }
}

export class Circle extends Mass {
    constructor(x, y, vx, vy, m, r) {
        super(x, y, vx, vy, m);
        this.r = r;
    }

    left = () => {
        return this.x - this.r;
    }

    top = () => {
        return this.y - this.r;
    }
}

export class box extends Mass {
    constructor(x, y, vx, vy, m, w, h, angle) {
        super(x, y, vx, vy, m);
        this.w = w;
        this.h = h;
        this.angle = angle;
    }

    left = () => {
        return this.x - this.w / 2;
    }

    top = () => {
        return this.y - this.h / 2;
    }
}