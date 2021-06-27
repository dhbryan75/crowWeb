import { Line } from "../../Assets/Physic2D";


const dt = 0.1;

const QUEUED = 0;
const NORMAL = 1;
const LANECHANGING = 2;
const REMOVED = -1;

export class CarInfo {
    static carCount = 0;

    constructor(laneInfo, length, breadth, colors, a, d, b, maxV, laneChangeV, safeDistance, dangerDistance, initV) {
        this.id = CarInfo.carCount++;
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
    static trafficLightCount = 0;

    constructor(laneInfo, x, period, delay, duration) {
        this.id = TrafficLightInfo.trafficLightCount++;
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



export class LaneInfo {
    static count = 0;
    
    constructor(roadInfo, laneIdx) {
        this.id = LaneInfo.count++;
        this.roadInfo = roadInfo;
        this.laneIdx = laneIdx;

        this.length = roadInfo.length;
        this.breadth = roadInfo.laneWidth - roadInfo.laneBorderWidth;
        this.borderWidth = roadInfo.laneBorderWidth;

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
    static roadCount = 0;

    constructor(x1, y1, x2, y2, zIndex, lane, speedLimit, borderWidth, laneWidth, laneBorderWidth) {
        this.id = RoadInfo.roadCount++;
        this.line = new Line(x1, y1, x2, y2);
        this.zIndex = zIndex;
        this.lane = lane;
        this.speedLimit = speedLimit;
        this.borderWidth = borderWidth;
        this.laneWidth = laneWidth;
        this.laneBorderWidth = laneBorderWidth;

        this.center = this.line.center();
        this.length = this.line.length();
        this.breadth = laneWidth * lane - laneBorderWidth;
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

