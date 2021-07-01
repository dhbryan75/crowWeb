import { Vector, Line } from "../../Assets/Physic2D";
import { randomBool, randomSelect } from "../../Assets/Functions";

const QUEUED = 0;
const ONLANE = 1;
const LANECHANGING = 2;
const ONCONN = 3;
const REMOVED = -1;

export class CarInfo {
    static count = 0;

    constructor(laneInfo, length, breadth, colors, a, d, b, maxV, laneChangeV, safeDistance, dangerDistance, initV) {
        this.id = CarInfo.count++;
        this.state = QUEUED;
        
        this.laneInfo = laneInfo;
        this.roadInfo = laneInfo.roadInfo;

        this.length = length;
        this.breadth = breadth;
        this.colors = colors;

        this.a = a;
        this.d = d;
        this.b = b;
        this.maxV = maxV;
        this.laneChangeV = laneChangeV;
        this.safeDistance = safeDistance;
        this.dangerDistance = dangerDistance;

        this.v = initV;
        this.x = 0;

        this.nextLaneInfo = laneInfo;
        this.laneChangeRate = 0;
        this.y = 0;

        this.connInfo = null;
        this.destConnInfo = randomSelect(laneInfo.nextInfos);
    }

    updatePosition = () => {
        let p;
        if(this.state === ONCONN) {
            p = this.connInfo.getPosition(this.x, this.length, this.breadth);
        }
        else {
            p = this.laneInfo.getPosition(this.x, this.y, this.length, this.breadth);
        }
        this.left = p.left;
        this.top = p.top;
        this.angle = p.angle;
        this.zIndex = p.zIndex + 3;
    }

    updateLane = () => {
        if(this.state === ONCONN) {
            if(this.x > this.connInfo.length) {
                let idx = this.connInfo.carInfos.findIndex(carInfo => carInfo.id === this.id);
                if(idx !== undefined) this.connInfo.carInfos.splice(idx, 1);
                this.state = ONLANE;
                this.laneInfo = this.connInfo.nextInfo;
                this.roadInfo = this.laneInfo.roadInfo;
                this.laneInfo.carInfos.push(this);
                this.destConnInfo = randomSelect(this.laneInfo.nextInfos);
                this.x = 0;
                this.laneChangeRate = 0;
                this.y = 0;
            }
        }
        else {
            if(this.x > this.laneInfo.length) {
                if(!!this.destConnInfo) {
                    let idx = this.laneInfo.carInfos.findIndex(carInfo => carInfo.id === this.id);
                    if(idx !== undefined) this.laneInfo.carInfos.splice(idx, 1);
                    this.state = ONCONN;
                    this.connInfo = this.destConnInfo;
                    this.connInfo.carInfos.push(this);
                    this.x = 0;
                    this.laneChangeRate = 0;
                    this.y = 0;
                }
                else {
                    this.state = REMOVED;
                }
            }
        }
    }

    move = dt => {
        this.x += this.v * dt;
    }

    registerCar = () => {
        if(this.state === ONCONN) {
            this.connInfo.carInfos.push(this);
        }
        else {
            this.laneInfo.carInfos.push(this);
            if(this.state === LANECHANGING) {
                this.nextLaneInfo.laneChangingCarInfos.push(this);
            }
        }
    }

    laneChange = dt => {
        this.laneChangeRate += this.laneChangeV * dt;
        this.y = this.roadInfo.laneWidth * this.laneChangeRate * (this.nextLaneInfo.laneIdx - this.laneInfo.laneIdx);
        if(this.laneChangeRate >= 1) {
            let idx = this.laneInfo.carInfos.findIndex(carInfo => carInfo.id === this.id);
            if(idx !== undefined) this.laneInfo.carInfos.splice(idx, 1);
            this.state = ONLANE;
            this.laneInfo = this.nextLaneInfo;
            this.laneChangeRate = 0;
            this.y = 0;
            this.destConnInfo = randomSelect(this.laneInfo.nextInfos);
        }
    }

    isReady = () => {
        let carInfos = this.laneInfo.carInfos;
        carInfos = carInfos.concat(this.laneInfo.laneChangingCarInfos);

        if(carInfos.some(carInfo => {
            if(this.id === carInfo.id) return false;
            if(carInfo.isQueued()) return false;
            if(this.x <= carInfo.x && carInfo.x - carInfo.length < this.x + this.safeDistance) return true;
            return false;
        })) return false;

        return true;
    }
        
    isSafe = (laneInfo, distance) => {
        if(this.state === ONCONN) {
            let carInfos = laneInfo.carInfos;
            if(carInfos.some(carInfo => {
                if(this.id === carInfo.id) return false;
                if(carInfo.isQueued()) return false;
                let x = carInfo.x;
                if(this.x <= x && x - carInfo.length < this.x + distance) return true;
                return false;
            })) return false;

            let controlInfos = laneInfo.controlInfos;
            if(controlInfos.some(controlInfo => {
                if(controlInfo.isOpened()) return false;
                let x = controlInfo.x;
                if(this.x <= x && x < this.x + distance) return true;
                return false;
            })) return false;

            if(laneInfo.length < this.x + distance) {
                let carInfos = laneInfo.nextInfo.carInfos;
                carInfos = carInfos.concat(laneInfo.nextInfo.laneChangingCarInfos);
                if(carInfos.some(carInfo => {
                    if(this.id === carInfo.id) return false;
                    if(carInfo.isQueued()) return false;
                    let x = laneInfo.length + carInfo.x;
                    if(this.x <= x && x - carInfo.length < this.x + distance) return true;
                    return false;
                })) return false;

                let controlInfos = laneInfo.nextInfo.controlInfos;
                if(controlInfos.some(controlInfo => {
                    if(controlInfo.isOpened()) return false;
                    let x = laneInfo.length + controlInfo.x;
                    if(this.x <= x && x < this.x + distance) return true;
                    return false;
                })) return false;
            }
        }
        else {
            let carInfos = laneInfo.carInfos;
            carInfos = carInfos.concat(laneInfo.laneChangingCarInfos);
            if(carInfos.some(carInfo => {
                if(this.id === carInfo.id) return false;
                if(carInfo.isQueued()) return false;
                let x = carInfo.x;
                if(this.x <= x && x - carInfo.length < this.x + distance) return true;
                return false;
            })) return false;
            
            let controlInfos = laneInfo.controlInfos;
            if(controlInfos.some(controlInfo => {
                if(controlInfo.isOpened()) return false;
                let x = controlInfo.x;
                if(this.x <= x && x < this.x + distance) return true;
                return false;
            })) return false;

            if(!!this.destConnInfo && laneInfo.length < this.x + distance) {
                let carInfos = this.destConnInfo.carInfos;
                if(carInfos.some(carInfo => {
                    if(this.id === carInfo.id) return false;
                    if(carInfo.isQueued()) return false;
                    let x = laneInfo.length + carInfo.x;
                    if(this.x <= x && x - carInfo.length < this.x + distance) return true;
                    return false;
                })) return false;

                let controlInfos = this.destConnInfo.controlInfos;
                if(controlInfos.some(controlInfo => {
                    if(controlInfo.isOpened()) return false;
                    let x = laneInfo.length + controlInfo.x;
                    if(this.x <= x && x < this.x + distance) return true;
                    return false;
                })) return false;

                if(laneInfo.length + this.destConnInfo.length < this.x + distance) {
                    let carInfos = this.destConnInfo.nextInfo.carInfos;
                    if(carInfos.some(carInfo => {
                        if(this.id === carInfo.id) return false;
                        if(carInfo.isQueued()) return false;
                        let x = laneInfo.length + this.destConnInfo.length + carInfo.x;
                        if(this.x <= x && x - carInfo.length < this.x + distance) return true;
                        return false;
                    })) return false;
    
                    let controlInfos = this.destConnInfo.nextInfo.controlInfos;
                    if(controlInfos.some(controlInfo => {
                        if(controlInfo.isOpened()) return false;
                        let x = laneInfo.length + this.destConnInfo.length + controlInfo.x;
                        if(this.x <= x && x < this.x + distance) return true;
                        return false;
                    })) return false;
                }
            }
        }
        
        return true;
    }

    isChangable = laneInfo => {
        if(!laneInfo) return false;
        if(!laneInfo.nextInfos.some(connInfo => {
            return (connInfo.nextInfo.roadInfo.id === this.destConnInfo.nextInfo.roadInfo.id);
        })) return false;
        if(this.x - this.length < 0) return false;
        if(this.roadInfo.length < this.x + this.safeDistance) return false;

        let carInfos = laneInfo.carInfos;
        carInfos = carInfos.concat(laneInfo.laneChangingCarInfos);
        let controlInfos = laneInfo.controlInfos;

        if(carInfos.some(carInfo => {
            if(this.id === carInfo.id) return false;
            if(carInfo.isQueued()) return false;
            if(this.x <= carInfo.x && carInfo.x - carInfo.length < this.x + this.safeDistance) return true;
            if(carInfo.x <= this.x && this.x - this.length < carInfo.x + this.dangerDistance) return true;
            return false;
        })) return false;

        if(controlInfos.some(controlInfo => {
            if(controlInfo.isOpened()) return false;
            if(this.x <= controlInfo.x && controlInfo.x < this.x + this.safeDistance) return true;
            return false;
        })) return false;

        return true;
    }

    isSpeeding = () => {
        return this.v > this.roadInfo.speedLimit;
    }

    accelerate = dt => {
        this.v += this.a * dt;
        this.v = Math.min(this.v, this.maxV, this.roadInfo.speedLimit);
    }

    deccelerate = dt => {
        this.v -= this.d * dt;
        this.v = Math.max(this.v, 0);
    }

    brake = dt => {
        this.v -= this.b * dt;
        this.v = Math.max(this.v, 0);
    }

    tryLaneChange = () => {
        if(this.isChangable(this.laneInfo.leftLaneInfo())) {
            this.state = LANECHANGING;
            this.nextLaneInfo = this.laneInfo.leftLaneInfo();
            this.nextLaneInfo.laneChangingCarInfos.push(this);
        }
        else if(this.isChangable(this.laneInfo.rightLaneInfo())) {
            this.state = LANECHANGING;
            this.nextLaneInfo = this.laneInfo.rightLaneInfo();
            this.nextLaneInfo.laneChangingCarInfos.push(this);
        }
    }

    isRemoved = () => {
        return this.state === REMOVED;
    }

    isQueued = () => {
        return this.state === QUEUED;
    }

    progress = (dt) => {
        if(this.state === QUEUED) {
            if(this.isReady()) {
                this.state = ONLANE;
            }
            else {
                return;
            }
        }
        else if(this.state === ONLANE) {
            if(this.isSpeeding()) {
                this.brake(dt);
            }
            else if(!this.isSafe(this.laneInfo, this.dangerDistance)) {
                this.tryLaneChange();
                this.brake(dt);
            }
            else if(!this.isSafe(this.laneInfo, this.safeDistance)) {
                this.tryLaneChange();
                this.deccelerate(dt);
            }
            else {
                this.accelerate(dt);
            }
        }
        else if(this.state === LANECHANGING) {
            if(this.isSpeeding()) {
                this.brake(dt);
            }
            else if(!(this.isSafe(this.laneInfo, this.dangerDistance) && this.isSafe(this.nextLaneInfo, this.dangerDistance))) {
                this.brake(dt);
            }
            else if(!(this.isSafe(this.laneInfo, this.safeDistance) && this.isSafe(this.nextLaneInfo, this.safeDistance))) {
                this.deccelerate(dt);
            }
            else {
                this.accelerate(dt);
            }
            this.laneChange(dt);
        }
        else if(this.state === ONCONN) {
            if(this.isSpeeding()) {
                this.brake(dt);
            }
            else if(!this.isSafe(this.connInfo, this.dangerDistance)) {
                this.brake(dt);
            }
            else if(!this.isSafe(this.connInfo, this.safeDistance)) {
                this.deccelerate(dt);
            }
            else {
                this.accelerate(dt);
            }
        }

        this.move(dt);
        this.updateLane();
        this.updatePosition();
    }
};


export class ControlInfo {
    static count = 0;

    constructor(laneInfo, x, period, delay, duration) {
        this.id = ControlInfo.count++;

        if(!!laneInfo.roadInfo) {
            this.laneInfo = laneInfo;
            this.roadInfo = laneInfo.roadInfo;
            laneInfo.controlInfos.push(this);
        }
        else {
            this.connInfo = laneInfo;
            laneInfo.controlInfos.push(this);
        }

        this.x = x;
        this.period = period;
        this.delay = delay;
        this.duration = duration;

        this.t = period - delay;
    }

    updatePosition = () => {
        let p;
        if(!!this.laneInfo) {
            p = this.laneInfo.getPosition(this.x, 0, this.width(), this.width());
        }
        else {
            p = this.connInfo.getPosition(this.x, this.width(), this.width());
        }
        this.left = p.left;
        this.top = p.top;
        this.angle = p.angle; 
        this.zIndex = p.zIndex + 2;
    }

    progress = () => {
        this.t = (this.t + 1) % this.period;
        this.updatePosition();
    }
    
    isOpened = () => {
        return this.t > this.duration;
    }

    remainTime = () => {
        return this.isOpened() ? (this.period - this.t) : (this.duration - this.t);
    }

    width = () => {
        return this.remainTime() * 0.05;
    }
}



export class ConnInfo {
    static count = 0;

    constructor(prevInfo, nextInfo) {
        this.id = ConnInfo.count++;
        this.prevInfo = prevInfo;
        this.nextInfo = nextInfo;
        prevInfo.nextInfos.push(this);
        this.zIndex = (prevInfo.zIndex + nextInfo.zIndex) / 2;
        this.breadth = prevInfo.breadth;
        
        this.carInfos = [];
        this.controlInfos = [];

        let l1 = this.prevInfo.line;
        let l2 = this.nextInfo.line;

        
        let p = Line.intersection(l1, l2);
        this.isStraight = !p;

        if(this.isStraight) {
            this.line = new Line(l1.p2.x, l1.p2.y, l2.p1.x, l2.p1.y);
            this.length = this.line.length();
            let c = this.line.center();
            this.left = c.x - this.length / 2;
            this.top = c.y - this.breadth / 2;
            this.angle = this.line.angle();
        }
        else {
            let a = Vector.outerProd(l1.d, l2.d) > 0;
            let isOnL1 = (l1.p1.x < l1.p2.x && p.x < l1.p2.x) || (l1.p2.x < l1.p1.x && l1.p2.x < p.x) || (l1.p1.y < l1.p2.y && p.y < l1.p2.y) || (l1.p2.y < l1.p1.y && l1.p2.y < p.y);
            let isOnL2 = (l2.p1.x < l2.p2.x && l2.p1.x < p.x) || (l2.p2.x < l2.p1.x && p.x < l2.p1.x) || (l2.p1.y < l2.p2.y && l2.p1.y < p.y) || (l2.p2.y < l2.p1.y && p.y < l2.p1.y);
            let d1 = Vector.dist(l1.p2, p);
            let d2 = Vector.dist(l2.p1, p);
    
            if(isOnL1 && isOnL2) {
                if(d1 > d2) {
                    this.length1 = 0;
                    this.length3 = d1 - d2;
                }
                else {
                    this.length1 = d2 - d1;
                    this.length3 = 0;
                }
                this.isClockwise = !a;
            }
            else if(isOnL1) {
                this.length1 = 0;
                this.length3 = d1 + d2;
                this.isClockwise = !a;
            }
            else if(isOnL2) {
                this.length1 = d1 + d2;
                this.length3 = 0;
                this.isClockwise = !a;
            }
            else {
                if(d1 > d2) {
                    this.length1 = d1 - d2;
                    this.length3 = 0;
                }
                else {
                    this.length1 = 0;
                    this.length3 = d2 - d1;
                }
                this.isClockwise = a;
            }
            let q1 = l1.p2.add(l1.dir().mul(this.length1));
            let r1 = q1.add(l1.dir().rot(Math.PI / 2));
            let m1 = new Line(q1.x, q1.y, r1.x, r1.y);
            let q2 = l2.p1.add(l2.dir().mul(-this.length3));
            let r2 = q2.add(l2.dir().rot(Math.PI / 2));
            let m2 = new Line(q2.x, q2.y, r2.x, r2.y);
    
            this.center = Line.intersection(m1, m2);
            this.radius = Vector.dist(this.center, q1);
            this.left2 = this.center.x - this.radius - this.breadth / 2;
            this.top2 = this.center.y - this.radius - this.breadth / 2;
    
            let b = this.isClockwise ? (m2.angle() - m1.angle()) : (m1.angle() - m2.angle());
            if(b < 0) b += Math.PI * 2;
            this.length2 = this.radius * b;
            this.length = this.length1 + this.length2 + this.length3;
    
            this.line1 = new Line(l1.p2.x, l1.p2.y, q1.x, q1.y);
            let c1 = this.line1.center();
            this.left1 = c1.x - this.length1 / 2;
            this.top1 = c1.y - this.breadth / 2;
            this.angle1 = l1.angle();
    
            this.line21 = new Line(this.center.x, this.center.y, q1.x, q1.y);
            this.line22 = new Line(this.center.x, this.center.y, q2.x, q2.y);
    
            this.line3 = new Line(q2.x, q2.y, l2.p1.x, l2.p1.y); 
            let c3 = this.line3.center();
            this.left3 = c3.x - this.length3 / 2;
            this.top3 = c3.y - this.breadth / 2;
            this.angle3 = l2.angle();
        }
    }

    reset = () => {
        this.carInfos = [];
    }

    getPosition = (x, width, height) => {
        let left, top, angle;
        if(this.isStraight) {
            let l = this.line;
            let d = l.dir();
            let c = l.p1.add(d.mul(x - width / 2));
            left = c.x - width / 2;
            top = c.y - height / 2;
            angle = this.angle;
        }
        else {
            if(x < this.length1) {
                let l = this.line1;
                let d = l.dir();
                let c = l.p1.add(d.mul(x - width / 2));
                left = c.x - width / 2;
                top = c.y - height / 2;
                angle = this.angle1;
            }
            else if(x < this.length1 + this.length2) {
                x -= this.length1;
                let a = x / this.radius;
                let r = this.line21.d.rot(this.isClockwise ? a : -a);
                let d = r.dir().rot(this.isClockwise ? Math.PI/2 : -Math.PI/2).mul(-width / 2);
                let c = this.center.add(r).add(d);
                left = c.x - width / 2;
                top = c.y - height / 2;
                angle = d.rot(Math.PI).angle();
            }
            else {
                x -= this.length1 + this.length2;
                let l = this.line3;
                let d = l.dir();
                let c = l.p1.add(d.mul(x - width / 2));
                left = c.x - width / 2;
                top = c.y - height / 2;
                angle = this.angle3;
            }    
        }
        let zIndex = this.zIndex;

        return {
            left: left,
            top: top,
            angle: angle,
            zIndex: zIndex,
        };
    }
}



export class LaneInfo {
    static count = 0;
    
    constructor(roadInfo, laneIdx) {
        this.id = LaneInfo.count++;
        this.roadInfo = roadInfo;
        this.laneIdx = laneIdx;

        this.length = roadInfo.length;
        this.breadth = roadInfo.laneWidth - roadInfo.laneBorderWidth;
        this.borderWidth = roadInfo.laneBorderWidth;
        
        this.left = 0;
        this.top = laneIdx * roadInfo.laneWidth;
        this.angle = roadInfo.angle;
        this.zIndex = roadInfo.zIndex;

        this.carInfos = [];
        this.laneChangingCarInfos = [];
        this.controlInfos = [];
        this.nextInfos = [];

        let y = laneIdx * roadInfo.laneWidth + this.breadth / 2 - roadInfo.breadth / 2;
        let vec = roadInfo.line.dir().rot(Math.PI / 2).mul(y);
        this.line = roadInfo.line.parallelTranslation(vec);
    }

    leftLaneInfo = () => {
        return this.roadInfo.laneInfos[this.laneIdx - 1];
    }

    rightLaneInfo = () => {
        return this.roadInfo.laneInfos[this.laneIdx + 1];
    }
    
    reset = () => {
        this.carInfos = [];
        this.laneChangingCarInfos = [];
    }

    getPosition = (x, y, width, height) => {
        let l = this.line;
        let d = l.dir();
        let c = l.p1.add(d.mul(x - width / 2));
        if(y !== 0) {
            c = c.add(d.rot(Math.PI / 2).mul(y));
        }
        let left = c.x - width / 2;
        let top = c.y - height / 2;
        let angle = this.angle;
        let zIndex = this.zIndex;

        return {
            left: left,
            top: top,
            angle: angle,
            zIndex: zIndex,
        };
    }
}



export class RoadInfo {
    static count = 0;

    constructor(x1, y1, x2, y2, zIndex, lane, speedLimit, borderWidth, laneWidth, laneBorderWidth) {
        this.id = RoadInfo.count++;
        this.line = new Line(x1, y1, x2, y2);
        this.zIndex = zIndex;
        this.lane = lane;
        this.speedLimit = speedLimit;
        this.borderWidth = borderWidth;
        this.laneWidth = laneWidth;
        this.laneBorderWidth = laneBorderWidth;

        this.length = this.line.length();
        this.breadth = laneWidth * lane - laneBorderWidth;

        let c = this.line.center();
        this.left = c.x - this.length / 2;
        this.top = c.y - this.breadth / 2 - borderWidth;
        this.angle = this.line.angle();

        this.isSelected = false;

        this.laneInfos = [];
        for(let i=0; i<lane; i++) {
            this.laneInfos.push(new LaneInfo(this, i));
        }
    }

    reset = () => {
        this.laneInfos.forEach(laneInfo => {
            laneInfo.reset();
        });
    }

    toggleIsSelected = () => {
        this.isSelected ^= true;
    }
};



export class CarGenInfo {
    static count = 0;

    static carProps = [
        {
            name: "whiteCar",
            length: 45,
            breadth: 22,
            colors: {body: "#eee"},
            a: 25,
            d: 3,
            b: 40,
            maxV: 70,
            laneChangeV: 0.3,
            safeDistance: 140,
            dangerDistance: 90,
            initV: 30,
        }, 
        {
            name: "yellowCar",
            length: 45,
            breadth: 22,
            colors: {body: "#ff8"},
            a: 25,
            d: 3,
            b: 40,
            maxV: 70,
            laneChangeV: 0.3,
            safeDistance: 140,
            dangerDistance: 90,
            initV: 30,
        }, 
        {
            name: "greenCar",
            length: 45,
            breadth: 22,
            colors: {body: "#8f8"},
            a: 25,
            d: 3,
            b: 40,
            maxV: 70,
            laneChangeV: 0.3,
            safeDistance: 140,
            dangerDistance: 90,
            initV: 30,
        }, 
        {
            name: "grayTruck",
            length: 60,
            breadth: 22,
            colors: {body: "#bbb"},
            a: 20,
            d: 3,
            b: 40,
            maxV: 60,
            laneChangeV: 0.2,
            safeDistance: 100,
            dangerDistance: 70,
            initV: 30,
        }, 
        {
            name: "redBus",
            length: 80,
            breadth: 22,
            colors: {body: "#f88"},
            a: 15,
            d: 3,
            b: 40,
            maxV: 55,
            laneChangeV: 0.15,
            safeDistance: 90,
            dangerDistance: 60,
            initV: 30,
        }, 
    ];

    constructor(laneInfo, prob) {
        this.id = CarGenInfo.count++;
        
        this.laneInfo = laneInfo;
        this.prob = prob;
    }

    generateCar = carInfos => {
        if(!randomBool(this.prob)) return;

        let carProp = randomSelect(CarGenInfo.carProps);
        carInfos.push(new CarInfo(
            this.laneInfo, 
            carProp.length,
            carProp.breadth,
            carProp.colors,
            carProp.a,
            carProp.d,
            carProp.b,
            carProp.maxV,
            carProp.laneChangeV,
            carProp.safeDistance,
            carProp.dangerDistance,
            carProp.initV,
        ));
    }
}
