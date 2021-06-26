import { Line } from "../../Assets/Physic2D";


const gridGap = 5;
const dt = 0.1;

export class RoadInfo {
    static roadCount = 0;

    constructor(x1, y1, x2, y2, lane12, lane21, zIndex, speedLimit, centerLineWidth, roadBorderWidth, laneWidth, laneBorderWidth) {
        this.id = RoadInfo.roadCount++;
        this.line = new Line(x1, y1, x2, y2);
        this.length = this.line.length();
        this.lane12 = lane12;
        this.lane21 = lane21;
        this.lane = lane12 + lane21;
        this.zIndex = zIndex;
        this.speedLimit = speedLimit;
        this.centerLineWidth = centerLineWidth;
        this.roadBorderWidth = roadBorderWidth;
        this.laneWidth = laneWidth;
        this.laneBorderWidth = laneBorderWidth;

        this.isSelected = false;
        this.gridN = this.length / gridGap;
        this.lane12Grid = [];
        for(let i=0; i<lane12; i++) {
            let list = [];
            for(let j=0; j<this.gridN; j++) {
                list.push(false);
            }
            this.lane12Grid.push(list);
        }

        this.lane21Grid = [];
        for(let i=0; i<lane21; i++) {
            let list = [];
            for(let j=0; j<this.gridN; j++) {
                list.push(false);
            }
            this.lane21Grid.push(list);
        }

        this.carInfos = [];
        this.trafficLightInfos = [];
    }

    reset = () => {
        for(let i=0; i<this.lane12; i++) {
            for(let j=0; j<this.gridN; j++) {
                this.lane12Grid[i][j] = false;
            }
        }
        for(let i=0; i<this.lane21; i++) {
            for(let j=0; j<this.gridN; j++) {
                this.lane21Grid[i][j] = false;
            }
        }
        this.carInfos = [];
        this.trafficLightInfos = [];
    }

    drawGrid = () => {
        this.carInfos.forEach(carInfo => {
            if(carInfo.isQueued()) return;
            let grid = carInfo.isForward ? this.lane12Grid : this.lane21Grid;
            let rear = Math.floor(carInfo.x / gridGap);
            let front = Math.floor((carInfo.x + carInfo.length) / gridGap);
            for(let idx=rear; idx<=front; idx++) {
                if(0 <= idx && idx < this.gridN) {
                    grid[carInfo.lane][idx] = true;
                    if(carInfo.state == LANECHANGING) {
                        grid[carInfo.nextLane][idx] = true;
                    }
                }
            }
        });
        this.trafficLightInfos.forEach(trafficLightInfo => {
            if(trafficLightInfo.isOpened()) return;
            let grid = trafficLightInfo.isForward ? this.lane12Grid : this.lane21Grid;
            let idx = Math.floor(trafficLightInfo.x / gridGap);
            if(0 <= idx && idx < this.gridN) {
                grid[trafficLightInfo.lane][idx] = true;
            }
        });
    }

    toggleIsSelected = () => {
        this.isSelected ^= true;
    }
};




const QUEUED = 0;
const NORMAL = 1;
const LANECHANGING = 2;
const REMOVED = -1;

export class CarInfo {
    static carCount = 0;

    constructor(roadInfo, isForward, lane, length, breadth, colors, a, d, b, maxV, laneChangeMinV, laneChangeV, safeDistance, dangerDistance, initV) {
        this.id = CarInfo.carCount++;
        this.state = QUEUED;
        
        this.roadInfo = roadInfo;
        this.isForward = isForward;
        this.lane = lane;

        this.length = length;
        this.breadth = breadth;
        this.colors = colors;

        this.a = a;
        this.d = d;
        this.b = b;
        this.maxV = maxV;
        this.laneChangeMinV = laneChangeMinV;
        this.laneChangeV = laneChangeV;
        this.safeDistance = safeDistance;
        this.dangerDistance = dangerDistance;

        this.v = initV;
        this.x = 0;

        this.nextLane = lane;
        this.laneChangeRate = 0;
    }

    move = () => {
        this.x += this.v * dt;
    }

    registerCar = () => {
        this.roadInfo.carInfos.push(this);
    }

    laneChange = () => {
        this.laneChangeRate += this.laneChangeV * dt;
        if(this.laneChangeRate >= 1) {
            this.state = NORMAL;
            this.lane = this.nextLane;
            this.laneChangeRate = 0;
        }
    }

    isCollision = (lane, gapN, gapM) => {
        for(let i=gapN; i<gapM; i++) {
            let idx = Math.floor(this.x / gridGap) + i;
            if(0 <= idx && idx <=this.roadInfo.gridN && lane[idx]) {
                return true;
            }
        }
        return false;
    }

    isReady = () => {
        let grid = this.isForward ? this.roadInfo.lane12Grid : this.roadInfo.lane21Grid;
        let laneGrid = grid[this.lane];
        let gapN = 0;
        let gapM = (this.length + this.dangerDistance) / gridGap;
        if(this.isCollision(laneGrid, gapN, gapM)) return false;
        return true;
    }
        
    isSafe = () => {
        let grid = this.isForward ? this.roadInfo.lane12Grid : this.roadInfo.lane21Grid;
        let laneGrid = grid[this.lane];
        let gapN = this.length / gridGap + 1;
        let gapM = (this.length + this.safeDistance) / gridGap;
        if(this.isCollision(laneGrid, gapN, gapM)) return false;

        if(this.state == LANECHANGING) {
            let laneGrid = grid[this.nextLane];
            let gapN = this.length / gridGap + 1;
            let gapM = (this.length + this.safeDistance) / gridGap;
            if(this.isCollision(laneGrid, gapN, gapM)) return false;
        }

        return true;
    }

    isDanger = () => {
        let grid = this.isForward ? this.roadInfo.lane12Grid : this.roadInfo.lane21Grid;
        let laneGrid = grid[this.lane];
        let gapN = this.length / gridGap + 1;
        let gapM = (this.length + this.dangerDistance) / gridGap;
        if(this.isCollision(laneGrid, gapN, gapM)) return true;

        if(this.state == LANECHANGING) {
            let laneGrid = grid[this.nextLane];
            let gapN = this.length / gridGap + 1;
            let gapM = (this.length + this.dangerDistance) / gridGap;
            if(this.isCollision(laneGrid, gapN, gapM)) return true;
        }

        return false;
    }

    isChangable = lane => {
        if(lane < 0 || lane >= (this.isForward ? this.roadInfo.lane12 : this.roadInfo.lane21)) return false;
        
        let grid = this.isForward ? this.roadInfo.lane12Grid : this.roadInfo.lane21Grid;
        let laneGrid = grid[lane];
        let gapN = -this.dangerDistance / gridGap;
        let gapM = (this.length + this.safeDistance) / gridGap;
        if(this.isCollision(laneGrid, gapN, gapM)) return false;
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
        if(this.v < this.laneChangeMinV) return;

        if(this.isChangable(this.lane - 1)) {
            this.state = LANECHANGING;
            this.nextLane = this.lane - 1;
        }
        else if(this.isChangable(this.lane + 1)) {
            this.state = LANECHANGING;
            this.nextLane = this.lane + 1;
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

    constructor(roadInfo, isForward, lane, x, period, delay, duration) {
        this.id = TrafficLightInfo.trafficLightCount++;
        this.roadInfo = roadInfo;
        this.isForward = isForward;
        this.lane = lane;
        this.x = x;
        this.period = period;
        this.delay = delay;
        this.duration = duration;

        this.t = period - delay;
    }

    registerTrafficLight = () => {
        this.roadInfo.trafficLightInfos.push(this);
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