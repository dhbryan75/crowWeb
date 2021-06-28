import { Vector, Line } from "../../Assets/Physic2D";


const dt = 0.1;

const QUEUED = 0;
const NORMAL = 1;
const LANECHANGING = 2;
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
    }

    move = () => {
        this.x += this.v * dt;
    }

    registerCar = () => {
        this.laneInfo.carInfos.push(this);
        if(this.state == LANECHANGING) {
            this.nextLaneInfo.laneChangingCarInfos.push(this);
        }
    }

    laneChange = () => {
        this.laneChangeRate += this.laneChangeV * dt;
        this.y = this.roadInfo.laneWidth * this.laneChangeRate * (this.nextLaneInfo.laneIdx - this.laneInfo.laneIdx);
        if(this.laneChangeRate >= 1) {
            this.state = NORMAL;
            this.laneInfo = this.nextLaneInfo;
            this.laneChangeRate = 0;
            this.y = 0;
        }
    }

    isReady = () => {
        let carInfos = this.laneInfo.carInfos;
        carInfos = carInfos.concat(this.laneInfo.laneChangingCarInfos);

        if(carInfos.some(carInfo => {
            if(this.id == carInfo.id) return false;
            if(carInfo.isQueued()) return false;
            if(this.x <= carInfo.x && carInfo.x < this.x + this.length + this.safeDistance) return true;
            return false;
        })) return false;

        return true;
    }
        
    isSafe = () => {
        let carInfos = this.laneInfo.carInfos;
        carInfos = carInfos.concat(this.laneInfo.laneChangingCarInfos);
        let trafficLightInfos = this.laneInfo.trafficLightInfos;

        if(this.state == LANECHANGING) {
            carInfos = carInfos.concat(this.nextLaneInfo.carInfos);
            carInfos = carInfos.concat(this.nextLaneInfo.laneChangingCarInfos);
            trafficLightInfos = trafficLightInfos.concat(this.nextLaneInfo.trafficLightInfos);
        }

        if(carInfos.some(carInfo => {
            if(this.id == carInfo.id) return false;
            if(carInfo.isQueued()) return false;
            if(this.x <= carInfo.x && carInfo.x < this.x + this.length + this.safeDistance) return true;
            return false;
        })) return false;

        if(trafficLightInfos.some(trafficLightInfo => {
            if(trafficLightInfo.isOpened()) return false;
            if(this.x + this.length <= trafficLightInfo.x && trafficLightInfo.x < this.x + this.length + this.safeDistance) return true;
            return false;
        })) return false;
        
        return true;
    }

    isDanger = () => {
        let carInfos = this.laneInfo.carInfos;
        carInfos = carInfos.concat(this.laneInfo.laneChangingCarInfos);
        let trafficLightInfos = this.laneInfo.trafficLightInfos;

        if(this.state == LANECHANGING) {
            carInfos = carInfos.concat(this.nextLaneInfo.carInfos);
            carInfos = carInfos.concat(this.nextLaneInfo.laneChangingCarInfos);
            trafficLightInfos = trafficLightInfos.concat(this.nextLaneInfo.trafficLightInfos);
        }

        if(carInfos.some(carInfo => {
            if(this.id == carInfo.id) return false;
            if(carInfo.isQueued()) return false;
            if(this.x <= carInfo.x && carInfo.x < this.x + this.length + this.dangerDistance) return true;
            return false;
        })) return true;

        if(trafficLightInfos.some(trafficLightInfo => {
            if(trafficLightInfo.isOpened()) return false;
            if(this.x + this.length <= trafficLightInfo.x && trafficLightInfo.x < this.x + this.length + this.dangerDistance) return true;
            return false;
        })) return true;

        return false;
    }

    isChangable = laneInfo => {
        if(!laneInfo) return false;

        let carInfos = laneInfo.carInfos;
        carInfos = carInfos.concat(laneInfo.laneChangingCarInfos);
        let trafficLightInfos = laneInfo.trafficLightInfos;

        if(carInfos.some(carInfo => {
            if(this.id == carInfo.id) return false;
            if(carInfo.isQueued()) return false;
            if(this.x <= carInfo.x && carInfo.x < this.x + this.length + this.safeDistance) return true;
            if(carInfo.x <= this.x && this.x < carInfo.x + carInfo.length + this.dangerDistance) return true;
            return false;
        })) return false;

        if(trafficLightInfos.some(trafficLightInfo => {
            if(trafficLightInfo.isOpened()) return false;
            if(this.x + this.length <= trafficLightInfo.x && trafficLightInfo.x < this.x + this.length + this.safeDistance) return true;
            return false;
        })) return false;

        return true;
    }

    isSpeeding = () => {
        return this.v > this.roadInfo.speedLimit;
    }

    accelerate = () => {
        this.v += this.a * dt;
        this.v = Math.min(this.v, this.maxV, this.roadInfo.speedLimit);
    }

    deccelerate = () => {
        this.v -= this.d * dt;
        this.v = Math.max(this.v, 0);
    }

    brake = () => {
        this.v -= this.b * dt;
        this.v = Math.max(this.v, 0);
    }

    isOverflow = () => {
        return this.x > this.roadInfo.length;
    }

    tryLaneChange = () => {
        if(this.state != NORMAL) return;

        if(this.isChangable(this.laneInfo.leftLaneInfo())) {
            this.state = LANECHANGING;
            this.nextLaneInfo = this.laneInfo.leftLaneInfo();
        }
        else if(this.isChangable(this.laneInfo.rightLaneInfo())) {
            this.state = LANECHANGING;
            this.nextLaneInfo = this.laneInfo.rightLaneInfo();
        }
    }

    isRemoved = () => {
        return this.state == REMOVED;
    }

    isQueued = () => {
        return this.state == QUEUED;
    }

    progress = () => {
        if(this.state == QUEUED) {
            if(this.isReady()) {
                this.state = NORMAL;
            }
            else {
                return;
            }
        }

        if(this.isSpeeding()) {
            this.brake();
        }
        else if(this.isDanger()) {
            this.tryLaneChange();
            this.brake();
        }
        else if(this.isSafe()) {
            this.accelerate();
        }
        else {
            this.tryLaneChange();
            this.deccelerate();
        }
        
        this.move();
        if(this.state == LANECHANGING) {
            this.laneChange();
        }

        if(this.isOverflow()) {
            this.state = REMOVED;
        }
    }
};


export class TrafficLightInfo {
    static count = 0;

    constructor(laneInfo, x, period, delay, duration) {
        this.id = TrafficLightInfo.count++;
        this.laneInfo = laneInfo;
        this.roadInfo = laneInfo.roadInfo;
        this.x = x;
        this.period = period;
        this.delay = delay;
        this.duration = duration;

        this.t = period - delay;

        laneInfo.trafficLightInfos.push(this);
    }

    progress = () => {
        this.t = (this.t + 1) % this.period;
    }
    
    isOpened = () => {
        return this.t > this.duration;
    }

    remainTime = () => {
        return this.duration - this.t;
    }
}



export class ConnectionInfo {
    static count = 0;

    constructor(prevLaneInfo, nextLaneInfo) {
        this.id = ConnectionInfo.count++;
        this.prevLaneInfo = prevLaneInfo;
        this.nextLaneInfo = nextLaneInfo;
        this.zIndex = (prevLaneInfo.roadInfo.zIndex + prevLaneInfo.roadInfo.zIndex) / 2;

        this.breadth = prevLaneInfo.breadth;

        let l1 = this.prevLaneInfo.line;
        let l2 = this.nextLaneInfo.line;

        let p = Line.intersection(l1, l2);
        console.log(l2.a, l2.b, p.x, p.y);
        let isOnL1 = (l1.p1.x < p.x && p.x < l1.p2.x) || (l1.p2.x < p.x && p.x < l1.p1.x);
        let isOnL2 = (l2.p1.x < p.x && p.x < l2.p2.x) || (l2.p2.x < p.x && p.x < l2.p1.x);
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
        }
        else if(isOnL1) {
            this.length1 = 0;
            this.length3 = d1 + d2;
        }
        else if(isOnL2) {
            this.length1 = d1 + d2;
            this.length3 = 0;
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
        }
        let q1 = l1.p2.copy();
        q1.add(l1.dir().mul(this.length1));
        let r1 = q1.copy();
        r1.add(l1.dir().rot(Math.PI / 2));
        let m1 = new Line(q1.x, q1.y, r1.x, r1.y);
        let q2 = l2.p1.copy();
        q2.add(l2.dir().mul(-this.length3));
        let r2 = q2.copy();
        r2.add(l2.dir().rot(Math.PI / 2));
        let m2 = new Line(q2.x, q2.y, r2.x, r2.y);

        this.center = Line.intersection(m1, m2);
        this.radius = Vector.dist(this.center, q1);

        //this.center = p;
        //this.radius = 0;
        this.left2 = this.center.x - this.radius - this.breadth / 2;
        this.top2 = this.center.y - this.radius - this.breadth / 2;

        this.angle = m2.angle() - m1.angle();
        this.length2 = this.radius * this.angle;
        this.length = this.length1 + this.length2 + this.length3;

        this.line1 = new Line(l1.p2.x, l1.p2.y, q1.x, q1.y);
        let c1 = this.line1.center();
        this.left1 = c1.x - this.length1 / 2;
        this.top1 = c1.y - this.breadth / 2;
        this.angle1 = this.line1.angle();

        this.line3 = new Line(q2.x, q2.y, l2.p1.x, l2.p1.y);
        let c3 = this.line3.center();
        this.left3 = c3.x - this.length3 / 2;
        this.top3 = c3.y - this.breadth / 2;
        this.angle3 = this.line3.angle();

        this.carInfos = [];
        this.trafficLightInfos = [];
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

        let vec = roadInfo.line.dir().rot(Math.PI / 2).mul(laneIdx * roadInfo.laneWidth + this.breadth / 2 - roadInfo.breadth / 2);
        this.line = roadInfo.line.copy();
        this.line.parallelTranslation(vec);

        this.carInfos = [];
        this.laneChangingCarInfos = [];
        this.trafficLightInfos = [];
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

