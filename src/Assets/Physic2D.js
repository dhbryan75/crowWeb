export class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    static sum = l => {
        let res = new Vector(0, 0);
        for(let i in l) {
            let v = l[i];
            res.add(v);
        }
        return res;
    }

    static avg = l => {
        return Vector.sum(l).mul(1 / l.length);
    }

    static dif = (v1, v2) => {
        return new Vector(v1.x - v2.x, v1.y - v2.y);
    }

    add = v => {
        this.x += v.x;
        this.y += v.y;
    }

    mul = c => {
        return new Vector(this.x * c, this.y * c);
    }

    rot = angle => {
        let cos = Math.cos(angle);
        let sin = Math.sin(angle);
        return new Vector(cos * this.x - sin * this.y, sin * this.y + cos * this.y);
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
        this.d = new Vector(x2 - x1, y2 - y1);
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

    dir = () => {
        return this.d.mul(this.length());
    }
}

export class Dot {
    constructor(x, y, vx, vy) {
        this.p = new Vector(x, y);
        this.v = new Vector(vx, vy);
    }

    move = dt => {
        this.p.add(this.v.mul(dt));
    }
}

export class Object extends Dot {
    constructor(x, y, vx, vy, m) {
        super(x, y, vx, vy);
        this.a = Vector(0, 0);
        this.m = m;
    }

    force = f => {
        this.a = f.mul(1 / this.m);
    }

    move = dt => {
        this.v.add(this.a.mul(dt));
        this.p.add(this.v.mul(dt));
    }
}

export class Circle extends Object {
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

export class box extends Object {
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