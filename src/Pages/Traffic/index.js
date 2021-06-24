import React from "react";

import Road from "./Road";
import { Line } from "../../Assets/Physic2D";
import { delay, randomBool, randomInt } from "../../Assets/Functions";
import { basicColors } from "../../Assets/Constants";
import "./style.css";



const gridGap = 5;
const safeDistance = 50;
const dt = 0.1;

class RoadInfo {
    static roadCount = 0;

    constructor(x1, y1, x2, y2, lane12, lane21, zIndex = 10, speedLimit = 50) {
        this.id = RoadInfo.roadCount++;
        this.line = new Line(x1, y1, x2, y2);
        this.length = this.line.length();
        this.lane12 = lane12;
        this.lane21 = lane21;
        this.lane = lane12 + lane21;
        this.zIndex = zIndex;
        this.speedLimit = speedLimit;

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
    }

    drawGrid = () => {
        for(let i in carInfos) {
            let carInfo = carInfos[i];
            let grid = carInfo.isForward ? this.lane12Grid : this.lane21Grid;
            let idx = Math.floor(carInfo.x / gridGap);
            if(0 <= idx && idx <=this.gridN) grid[carInfo.lane][idx] = true;
        }
    }
}


const NORMAL = 0;
const REMOVED = 1;

class CarInfo {
    static carCount = 0;

    constructor(length, breadth, colors, roadInfo, isForward, lane, v = 0, a = 10, b = 30) {
        this.id = CarInfo.carCount++;
        this.state = NORMAL;

        this.length = length;
        this.breadth = breadth;
        this.colors = colors;

        this.roadInfo = roadInfo;
        this.isForward = isForward;
        this.lane = lane;
        this.v = v;
        this.a = a;
        this.b = b;
        this.x = -this.length;
    }

    move = dt => {
        this.x += this.v * dt;
    }

    isSafe = () => {
        if(this.v > this.roadInfo.speedLimit) return false;

        let grid = this.isForward ? this.roadInfo.lane12Grid : this.roadInfo.lane21Grid;
        let gapN = (this.length + safeDistance) / gridGap;
        for(let i=1; i<gapN; i++) {
            let idx = Math.floor(this.x / gridGap) + i;
            if(0 <= idx && idx <=this.roadInfo.gridN && grid[this.lane][idx]) return false;
        }
        //connection

        return true;
    }

    accelerate = dt => {
        this.v += this.a * dt;
        this.v = Math.min(this.v, this.roadInfo.speedLimit);
    }

    brake = dt => {
        this.v -= this.b * dt;
        this.v = Math.max(this.v, 0);
    }

    isOverflow = () => {
        return this.x > this.roadInfo.length;
    }

    progress = dt => {
        if(this.isSafe()) {
            this.accelerate(dt);
        }
        else {
            this.brake(dt);
        }
        this.move(dt);
        if(this.isOverflow()) {
            this.state = REMOVED;
        }
    }
}

var roadInfos = [
    new RoadInfo(100, 150, 1200, 500, 3, 2),
];

var carInfos = [];


class TrafficPage extends React.Component {
    state = {
        roadProps: [],
    }

    init = () => {
        
    }

    randomEvent = () => {
        if(randomBool(0.05)) {
            let roadInfo = roadInfos[randomInt(0, roadInfos.length)];
            let isForward = randomBool(0.5);
            carInfos.push(new CarInfo(
                100, 
                50, 
                {body: basicColors[randomInt(0, basicColors.length)]}, 
                roadInfo, 
                isForward,
                randomInt(0, isForward ? roadInfo.lane12 : roadInfo.lane21),
            ));
        }
    }

    progress = () => {
        for(let i in roadInfos) {
            let roadInfo = roadInfos[i];
            roadInfo.reset();
        }
        for(let i in carInfos) {
            let carInfo = carInfos[i];
            carInfo.roadInfo.carInfos.push(carInfo);
        }
        for(let i in roadInfos) {
            let roadInfo = roadInfos[i];
            roadInfo.drawGrid();
        }
        for(let i in carInfos) {
            let carInfo = carInfos[i];
            carInfo.progress(dt);
        }
        for(let i=carInfos.length-1; i>=0; i--) {
            if(carInfos[i].state == REMOVED) {
                carInfos.splice(i, 1);
            }
        }
    }

    update = () => {
        let roadProps = [];
        for(let i in roadInfos) {
            let roadInfo = roadInfos[i];

            let carProps = [];
            for(let i in roadInfo.carInfos) {
                let carInfo = roadInfo.carInfos[i];
                carProps.push({
                    width: carInfo.length,
                    height: carInfo.breadth,
                    colors: carInfo.colors,
                    isForward: carInfo.isForward,
                    lane: carInfo.lane,
                    x: carInfo.x,
                });
            }

            roadProps.push({
                line: roadInfo.line,
                lane12: roadInfo.lane12,
                lane21: roadInfo.lane21,
                zIndex: roadInfo.zIndex,
                carProps: carProps,
            });
        }
        
        this.setState({
            ...this.state,
            roadProps: roadProps,
        });
    }


    animate = async() => {
        for(let iteration = 0; true; iteration++) {
            this.randomEvent();
            this.progress();
            this.update();
            await delay(10);
        }
    }

    renderRoads = () => {
        const { roadProps } = this.state;
        return roadProps.map(roadProp => {
            return (
                <Road
                    line={roadProp.line}
                    lane12={roadProp.lane12}
                    lane21={roadProp.lane21}
                    zIndex={roadProp.zIndex}
                    carProps={roadProp.carProps}
                />
            );
        })
    }
    

    componentDidMount() {
        this.init();
        this.animate();
    }

    render() {
        const { width, height } = this.props;
        const trafficStyle = {
            width: width,
            height: height,
        }

        return (
            <div className="traffic" style={trafficStyle}>
                {this.renderRoads()}
            </div>
        );
    }
}

export default TrafficPage;