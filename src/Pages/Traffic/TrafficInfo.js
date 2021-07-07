import { Vector, Line } from "../../Assets/Physic2D";
import { randomBool, randomSelect } from "../../Assets/Functions";

const QUEUED = 0;
const ONLANE = 1;
const LANECHANGING = 2;
const ONCONN = 3;
const REMOVED = -1;

const borderWidth = 8;
const laneWidth = 40;
const laneBorderWidth = 2;

export class CarInfo {
    static count = 0;
    static selected = [];

    constructor(laneInfo, length, breadth, colors, a, d, b, maxV, laneChangeV, safeDistance, dangerDistance) {
        this.id = CarInfo.count++;
        this.state = QUEUED;
        
        this.laneInfo = laneInfo;
        this.roadInfo = laneInfo.roadInfo;
        this.connInfo = null;
        this.destConnInfo = randomSelect(laneInfo.nextInfos);

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
        
        this.v = 0;
        this.x = 0;

        this.nextLaneInfo = laneInfo;
        this.laneChangeRate = 0;
        this.y = 0;


        /*
        state: 차량 현재 상태 (int)

        laneInfo: 현재 속한 레인
        roadInfo: 현재 속한 로드
        connInfo: 현재 속한 커넥션
        destConnInfo: 목적지 커넥션, 레인에 연결된 커넥션 중 랜덤 배정

        maxV: 최고 속력
        laneChangeV: 차선 변경 속력
        safeDistance: 안전 거리
        dangerDistance: 위험 거리
        v: 현재 속력
        x: 현재 레인/커넥션에서의 가로 위치

        nextLaneInfo: 차선 변경시, 레인
        laneChangeRate: 차선 변경시, 진행도 (0~1)
        y: 차선 변경시, 세로 위치
        */
    }

    registerCar = () => {
        if(this.state === QUEUED) {
            this.laneInfo.carInfos.push(this);
        }
        else if(this.state === ONLANE) {
            this.laneInfo.carInfos.push(this);
        }
        else if(this.state === ONCONN) {
            this.connInfo.carInfos.push(this);
        }
        else if(this.state === LANECHANGING) {
            this.laneInfo.carInfos.push(this);
            this.nextLaneInfo.carInfos.push(this);
        }
    }
    
    laneChange = dt => {
        this.laneChangeRate += this.laneChangeV * dt;
        this.y = this.roadInfo.laneWidth * this.laneChangeRate * (this.nextLaneInfo.laneIdx - this.laneInfo.laneIdx);
        if(this.laneChangeRate >= 1) {
            let idx = this.laneInfo.carInfos.findIndex(carInfo => carInfo.id === this.id);
            if(idx !== -1) this.laneInfo.carInfos.splice(idx, 1);
            this.state = ONLANE;
            this.laneInfo = this.nextLaneInfo;
            this.laneChangeRate = 0;
            this.y = 0;
            if(!!this.destConnInfo) {
                this.destConnInfo = this.laneInfo.nextInfos.find(connInfo => {
                    return connInfo.nextInfo.roadInfo.id === this.destConnInfo.nextInfo.roadInfo.id;
                });
            }
            else {
                this.destConnInfo = randomSelect(this.laneInfo.nextInfos);
            }

            
        }
    }

    isReady = () => {
        let carInfos = this.laneInfo.carInfos;
        
        if(carInfos.some(carInfo => {
            if(this.id === carInfo.id) return false;
            if(carInfo.isQueued()) return false;
            if(this.x <= carInfo.x && carInfo.x - carInfo.length < this.x + this.safeDistance) return true;
            return false;
        })) return false;
        
        return true;
    }
    
    isSafe = (laneInfo, distance) => {
        if(this.state === ONLANE || this.state === LANECHANGING) {
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
        else if(this.state === ONCONN) {
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
        
        return true;
    }

    isChangable = laneInfo => {
        //존재하지 않는 레인
        if(!laneInfo) return false;
        //목적지로 연결되지 않는 레인
        if(!!this.destConnInfo && !laneInfo.nextInfos.some(connInfo => {
            return (connInfo.nextInfo.roadInfo.id === this.destConnInfo.nextInfo.roadInfo.id);
        })) return false;
        //레인 시작에 너무 가까움 (거리: 0)
        if(this.x - this.length < 0) return false;
        //레인 끝에 너무 가까움 (거리: safeDistance)
        if(this.roadInfo.length < this.x + this.safeDistance) return false;
        
        let carInfos = laneInfo.carInfos;
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
            this.nextLaneInfo.carInfos.push(this);
        }
        else if(this.isChangable(this.laneInfo.rightLaneInfo())) {
            this.state = LANECHANGING;
            this.nextLaneInfo = this.laneInfo.rightLaneInfo();
            this.nextLaneInfo.carInfos.push(this);
        }
    }
    
    isRemoved = () => {
        return this.state === REMOVED;
    }
    
    isQueued = () => {
        return this.state === QUEUED;
    }
    
    isOnRoad = () => {
        return this.state === QUEUED || this.state === ONLANE || this.state === LANECHANGING;
    }

    isOnConn = () => {
        return this.state === ONCONN;
    }

    move = dt => {
        this.x += this.v * dt;
    }
    
    updateLane = () => {
        if(this.state === ONLANE || this.state === LANECHANGING) {
            if(this.x > this.laneInfo.length) {
                if(!!this.destConnInfo) {
                    let idx = this.laneInfo.carInfos.findIndex(carInfo => carInfo.id === this.id);
                    if(idx !== -1) this.laneInfo.carInfos.splice(idx, 1);
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
        else if(this.state === ONCONN) {
            if(this.x > this.connInfo.length) {
                let idx = this.connInfo.carInfos.findIndex(carInfo => carInfo.id === this.id);
                if(idx !== -1) this.connInfo.carInfos.splice(idx, 1);
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
    }
    
    updatePosition = () => {
        let p;
        if(this.state === ONLANE || this.state === LANECHANGING) {
            p = this.laneInfo.getPosition(this.x, this.y, this.length, this.breadth);
        }
        else if(this.state === ONCONN) {
            p = this.connInfo.getPosition(this.x, this.length, this.breadth);
        }
        this.left = p.left;
        this.top = p.top;
        this.angle = p.angle;
        this.zIndex = p.zIndex + 3;
    }

    update = (dt) => {
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
        if(this.isRemoved()) return;

        this.updatePosition();
    }

    onClick = e => {
        let idx = CarInfo.selected.findIndex(carInfo => carInfo.id === this.id);
        if(idx === -1) {
            CarInfo.selected.push(this);
        }
        else {
            CarInfo.selected.splice(idx, 1);
        }
    }

    isSelected = () => {
        return CarInfo.selected.includes(this);
    }
};


export class ControlInfo {
    static count = 0;
    static selected = [];

    constructor(laneInfo, x, period, delay, duration) {
        this.id = ControlInfo.count++;

        if(!!laneInfo.roadInfo) {
            //레인
            this.laneInfo = laneInfo;
            this.roadInfo = laneInfo.roadInfo;
            laneInfo.controlInfos.push(this);
            this.breadth = laneInfo.breadth;
        }
        else {
            //커넥션
            this.connInfo = laneInfo;
            laneInfo.controlInfos.push(this);
            this.breadth = laneInfo.breadth;
        }

        this.x = x;
        this.period = period;
        this.delay = delay;
        this.duration = duration;
        this.t = 0;

        /*
        roadInfo: 콘트롤이 속한 로드 정보
        laneInfo: 콘트롤이 속한 레인 정보
        connInfo: 콘트롤이 속한 커넥션 정보
        period: 전체 주기
        delay: 주기 시작 틱
        duration: 통제(빨간불) 시간
        t: 현재 틱
        */
    }

    updatePosition = () => {
        let p;
        if(!!this.laneInfo) {
            p = this.laneInfo.getPosition(this.x, 0, this.width(), this.breadth);
        }
        else {
            p = this.connInfo.getPosition(this.x, this.width(), this.breadth);
        }
        this.left = p.left;
        this.top = p.top;
        this.angle = p.angle; 
        this.zIndex = p.zIndex + 2;
    }

    update = iteration => {
        this.t = (iteration + this.period - this.delay) % this.period;
        this.updatePosition();
    }
    
    isOpened = () => {
        return this.t > this.duration;
    }

    remainTime = () => {
        return this.isOpened() ? (this.period - this.t) : (this.duration - this.t);
    }

    width = () => {
        return this.remainTime() * 0.03;
    }

    onClick = e => {
        let idx = ControlInfo.selected.findIndex(controlInfo => controlInfo.id === this.id);
        if(idx === -1) {
            ControlInfo.selected.push(this);
        }
        else {
            ControlInfo.selected.splice(idx, 1);
        }
    }

    isSelected = () => {
        return ControlInfo.selected.includes(this);
    }
}



export class ConnInfo {
    static count = 0;
    static selected = [];

    constructor(prevInfo, nextInfo) {
        this.id = ConnInfo.count++;
        this.prevInfo = prevInfo;
        this.nextInfo = nextInfo;
        prevInfo.nextInfos.push(this);
        nextInfo.prevInfos.push(this);
        this.zIndex = (prevInfo.zIndex + nextInfo.zIndex) / 2;
        this.breadth = prevInfo.breadth;
        
        this.carInfos = [];
        this.controlInfos = [];

        let l1 = this.prevInfo.line;
        let l2 = this.nextInfo.line;
        
        let p = Line.intersection(l1, l2);
        this.isStraight = !p;

        if(this.isStraight) {
            //직선 커넥션
            this.line = new Line(l1.p2.x, l1.p2.y, l2.p1.x, l2.p1.y);
            this.length = this.line.length();
            let c = this.line.center();
            this.left = c.x - this.length / 2;
            this.top = c.y - this.breadth / 2;
            this.angle = this.line.angle();
        }
        else {
            //휘어진 커넥션
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
            let q1 = l1.p2.add(l1.dir(this.length1));
            let r1 = q1.add(l1.dir().rot(Math.PI / 2));
            let m1 = new Line(q1.x, q1.y, r1.x, r1.y);
            let q2 = l2.p1.add(l2.dir(-this.length3));
            let r2 = q2.add(l2.dir().rot(Math.PI / 2));
            let m2 = new Line(q2.x, q2.y, r2.x, r2.y);
            let b = m2.angle() - m1.angle();
    
            this.center = Line.intersection(m1, m2);
            this.radius = Vector.dist(this.center, q1);
            this.left2 = this.center.x - this.radius - this.breadth / 2;
            this.top2 = this.center.y - this.radius - this.breadth / 2;
            this.width2 = (this.radius + this.breadth / 2) * 2;
            this.height2 = (this.radius + this.breadth / 2) * 2;
            
            this.angle2 = this.isClockwise ? b : -b;
            if(this.angle2 < 0) this.angle2 += Math.PI * 2;
            this.length2 = this.radius * this.angle2;
    
            this.line21 = new Line(this.center.x, this.center.y, q1.x, q1.y);
            this.line22 = new Line(this.center.x, this.center.y, q2.x, q2.y);
            this.angle21 = this.line21.angle();
            this.angle22 = this.line22.angle();

            this.line1 = new Line(l1.p2.x, l1.p2.y, q1.x, q1.y);
            let c1 = this.line1.center();
            this.left1 = c1.x - this.length1 / 2;
            this.top1 = c1.y - this.breadth / 2;
            this.angle1 = l1.angle();
    
            this.line3 = new Line(q2.x, q2.y, l2.p1.x, l2.p1.y); 
            let c3 = this.line3.center();
            this.left3 = c3.x - this.length3 / 2;
            this.top3 = c3.y - this.breadth / 2;
            this.angle3 = l2.angle();

            this.length = this.length1 + this.length2 + this.length3;
        }

        /*
        isStraight: 직선/휘어진 커넥션 여부
    
        line, length, left, top, angle: 직선 정보
    
        line1, length1, left1, top1, angle1: 파트1 정보
        center, radius, left2, top2, width2, height2, angle2, 
        line21, line22, angle21, angle22: 파트2 정보 (호, 부채꼴)
        line3, length3, left3, top3, angle3: 파트3 정보
        length: 총 길이
    
        prevInfo: 이전 레인 정보
        nextInfo: 다음 레인 정보
        carInfos: 커넥션에 속한 차량 정보, 매번 업데이트
        controlInfos: 커넥션에 속한 콘트롤 정보
        */
    }

    reset = () => {
        this.carInfos = [];
    }

    getPosition = (x, width, height) => {
        let left, top, angle;
        if(this.isStraight) {
            //직선 커넥션
            let l = this.line;
            let d = l.dir(x - width / 2);
            let c = l.p1.add(d);
            left = c.x - width / 2;
            top = c.y - height / 2;
            angle = this.angle;
        }
        else {
            //휘어진 커넥션
            if(x < this.length1) {
                let l = this.line1;
                let d = l.dir(x - width / 2);
                let c = l.p1.add(d);
                left = c.x - width / 2;
                top = c.y - height / 2;
                angle = this.angle1;
            }
            else if(x < this.length1 + this.length2) {
                x -= this.length1;
                let a = x / this.radius;
                let r = this.line21.d.rot(this.isClockwise ? a : -a);
                let d = r.dir(-width / 2).rot(this.isClockwise ? Math.PI/2 : -Math.PI/2);
                let c = this.center.add(r).add(d);
                left = c.x - width / 2;
                top = c.y - height / 2;
                angle = d.rot(Math.PI).angle();
            }
            else {
                x -= this.length1 + this.length2;
                let l = this.line3;
                let d = l.dir(x - width / 2);
                let c = l.p1.add(d);
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

    onClick = e => {
        let idx = ConnInfo.selected.findIndex(connInfo => connInfo.id === this.id);
        if(idx === -1) {
            ConnInfo.selected.push(this);
        }
        else {
            ConnInfo.selected.splice(idx, 1);
        }
    }

    isSelected = () => {
        return ConnInfo.selected.includes(this);
    }
}



export class LaneInfo {
    static count = 0;
    static selected = [];
    
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
        this.controlInfos = [];
        this.prevInfos = [];
        this.nextInfos = [];
        this.carGenInfo = null;

        let y = laneIdx * roadInfo.laneWidth + this.breadth / 2 - roadInfo.breadth / 2;
        let vec = roadInfo.line.dir(y).rot(Math.PI / 2);
        this.line = roadInfo.line.parallelTranslation(vec);

        /*
        line, length, left, top, angle: 직선 정보

        roadInfo: 레인이 속한 로드 정보
        laneIdx: 레인 번호
        carInfos: 레인에 속한 차량 정보, 차선 변경 중인 차는 중복됨, 매번 업데이트
        controlInfos: 레인에 속한 콘트롤 정보
        nextInfos: 다음 커넥션 정보
        */
    }

    leftLaneInfo = () => {
        return this.roadInfo.laneInfos[this.laneIdx - 1];
    }

    rightLaneInfo = () => {
        return this.roadInfo.laneInfos[this.laneIdx + 1];
    }
    
    reset = () => {
        this.carInfos = [];
    }

    getPosition = (x, y, width, height) => {
        let l = this.line;
        let d = l.dir();
        let c = l.p1.add(d.mul(x - width / 2));
        if(y !== 0) {
            //차선 변경
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

    onClick = e => {
        let idx = LaneInfo.selected.findIndex(laneInfo => laneInfo.id === this.id);
        if(idx === -1) {
            LaneInfo.selected.push(this);
        }
        else {
            LaneInfo.selected.splice(idx, 1);
        }
    }

    isSelected = () => {
        return LaneInfo.selected.includes(this);
    }
}



export class RoadInfo {
    static count = 0;
    static selected = [];

    constructor(x1, y1, x2, y2, zIndex, lane, speedLimit) {
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

        this.laneInfos = [];
        for(let i=0; i<lane; i++) {
            this.laneInfos.push(new LaneInfo(this, i));
        }

        /*
        line, length, left, top, angle: 직선 정보

        lane: 로드에 속한 레인 수
        speedLimit: 로드 속도 제한
        laneInfos: 로드에 속한 레인 정보
        */
    }

    reset = () => {
        this.laneInfos.forEach(laneInfo => {
            laneInfo.reset();
        });
    }

    onClick = e => {
        let idx = RoadInfo.selected.findIndex(roadInfo => roadInfo.id === this.id);
        if(idx === -1) {
            RoadInfo.selected.push(this);
        }
        else {
            RoadInfo.selected.splice(idx, 1);
        }
    }

    isSelected = () => {
        return RoadInfo.selected.includes(this);
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
            safeDistance: 100,
            dangerDistance: 90,
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
            safeDistance: 100,
            dangerDistance: 90,
        }, 
        {
            name: "blueCar",
            length: 45,
            breadth: 22,
            colors: {body: "#aaf"},
            a: 25,
            d: 3,
            b: 40,
            maxV: 70,
            laneChangeV: 0.3,
            safeDistance: 100,
            dangerDistance: 90,
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
            laneChangeV: 0.25,
            safeDistance: 100,
            dangerDistance: 70,
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
            laneChangeV: 0.2,
            safeDistance: 90,
            dangerDistance: 60,
        }, 
    ];

    constructor(laneInfo, prob) {
        this.id = CarGenInfo.count++;
        
        this.laneInfo = laneInfo;
        this.roadInfo = laneInfo.roadInfo;
        this.prob = prob;

        laneInfo.carGenInfo = this;

        /*
        laneInfo: 차량 생성할 레인 정보
        prob: 틱당 차량 생성 확률
        */
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
        ));
    }
}
