import React from "react";

import { delay, randomBool, randomInt } from "../../Assets/Functions";

import Road from "./Road";
import { RoadInfo, CarInfo } from "./TrafficInfo";
import "./style.css";


const centerLineWidth = 5;
const roadBorderWidth = 8;
const laneWidth = 40;
const laneBorderWidth = 2;


const basicCarProps = [
    {
        name: "whiteCar",
        length: 70,
        breadth: 28,
        colors: {body: "#eee"},
        a: 25,
        d: 1,
        b: 30,
        maxV: 70,
        laneChangeMinV: 40,
        laneChangeV: 0.3,
        safeDistance: 100,
        dangerDistance: 80,
        initV: 30,
    }, 
    {
        name: "yellowCar",
        length: 70,
        breadth: 28,
        colors: {body: "#ff8"},
        a: 25,
        d: 1,
        b: 30,
        maxV: 70,
        laneChangeMinV: 40,
        laneChangeV: 0.3,
        safeDistance: 100,
        dangerDistance: 80,
        initV: 30,
    }, 
    {
        name: "greenCar",
        length: 70,
        breadth: 28,
        colors: {body: "#8f8"},
        a: 25,
        d: 1,
        b: 30,
        maxV: 70,
        laneChangeMinV: 40,
        laneChangeV: 0.3,
        safeDistance: 100,
        dangerDistance: 80,
        initV: 30,
    }, 
    {
        name: "grayTruck",
        length: 90,
        breadth: 29,
        colors: {body: "#bbb"},
        a: 20,
        d: 1,
        b: 30,
        maxV: 60,
        laneChangeMinV: 40,
        laneChangeV: 0.2,
        safeDistance: 100,
        dangerDistance: 70,
        initV: 30,
    }, 
    {
        name: "redBus",
        length: 150,
        breadth: 30,
        colors: {body: "#f88"},
        a: 15,
        d: 1,
        b: 30,
        maxV: 55,
        laneChangeMinV: 40,
        laneChangeV: 0.15,
        safeDistance: 100,
        dangerDistance: 60,
        initV: 30,
    }, 
];


var roadInfos = [
    new RoadInfo(
        -100, -100, 
        800, 1200, 
        4, 3, 
        10, 
        90, 
        centerLineWidth,
        roadBorderWidth,
        laneWidth,
        laneBorderWidth,
    ),
    new RoadInfo(
        -100, 800, 
        800, -100, 
        2, 0, 
        0, 
        90, 
        centerLineWidth,
        roadBorderWidth,
        laneWidth,
        laneBorderWidth,
    ),
];

var carInfos = [];



const generateCar = () => {
    if(randomBool(0.12)) {
        let roadInfo = roadInfos[randomInt(0, roadInfos.length)];
        let isOneWay = roadInfo.lane12 == 0 || roadInfo.lane21 == 0;
        let isForward = isOneWay ? (roadInfo.lane12 > 0) : randomBool(0.5);
        let carProp = basicCarProps[randomInt(0, basicCarProps.length)];
        carInfos.push(new CarInfo(
            roadInfo, 
            isForward,
            randomInt(0, isForward ? roadInfo.lane12 : roadInfo.lane21),
            carProp.length,
            carProp.breadth,
            carProp.colors,
            carProp.a,
            carProp.d,
            carProp.b,
            carProp.maxV,
            carProp.laneChangeMinV,
            carProp.laneChangeV,
            carProp.safeDistance,
            carProp.dangerDistance,
            carProp.initV,
        ));
    }
};


const progress = () => {
    generateCar();

    roadInfos.forEach(roadInfo => {
        roadInfo.reset();
    });
    carInfos.forEach(carInfo => {
        carInfo.roadInfo.carInfos.push(carInfo);
    });
    roadInfos.forEach(roadInfo => {
        roadInfo.drawGrid();
    });
    carInfos.forEach(carInfo => {
        carInfo.progress();
    });

    for(let i=carInfos.length-1; i>=0; i--) {
        if(carInfos[i].isRemoved()) {
            carInfos.splice(i, 1);
        }
    }
};


class TrafficPage extends React.Component {
    state = {
        roadProps: [],
    }

    init = () => {}

    update = () => {
        let roadProps = roadInfos.map(roadInfo => {
            let carProps = roadInfo.carInfos.filter(carInfo => {
                return !carInfo.isQueued();
            }).map(carInfo => {
                return {
                    id: carInfo.id,
                    width: carInfo.length,
                    height: carInfo.breadth,
                    colors: carInfo.colors,
                    isForward: carInfo.isForward,
                    lane: carInfo.lane,
                    x: carInfo.x,
                    nextLane: carInfo.nextLane,
                    laneChangeRate: carInfo.laneChangeRate,
                };
            });

            return {
                id: roadInfo.id,
                line: roadInfo.line,
                lane12: roadInfo.lane12,
                lane21: roadInfo.lane21,
                zIndex: roadInfo.zIndex,
                centerLineWidth: roadInfo.centerLineWidth,
                roadBorderWidth: roadInfo.roadBorderWidth,
                laneWidth: roadInfo.laneWidth,
                laneBorderWidth: roadInfo.laneBorderWidth,
                isSelected: roadInfo.isSelected,
                carProps: carProps,
            };
        });
        
        this.setState({
            ...this.state,
            roadProps: roadProps,
        });
    }


    animate = async() => {
        for(let iteration = 0; iteration<40000; iteration++) {
            progress();
            this.update();
            await delay(15);
        }
        window.location.reload();
    }


    componentDidMount() {
        this.init();
        this.animate();
    }


    render() {
        const { width, height } = this.props;
        const { roadProps } = this.state;

        const trafficStyle = {
            width: width,
            height: height,
        }

        const roads = roadProps.map(roadProp => {
            const roadContainerStyle = {
                opacity: roadProp.isSelected ? 0.8 : 1,
            }
            const selectRoad = e => {
                roadInfos.find(roadInfo => roadInfo.id == roadProp.id).toggleIsSelected();
            }
            return (
                <div
                    className="roadContainer"
                    style={roadContainerStyle}
                    onClick={selectRoad}
                >
                    <Road
                        line={roadProp.line}
                        lane12={roadProp.lane12}
                        lane21={roadProp.lane21}
                        zIndex={roadProp.zIndex}
                        centerLineWidth={roadProp.centerLineWidth}
                        roadBorderWidth={roadProp.roadBorderWidth}
                        laneWidth={roadProp.laneWidth}
                        laneBorderWidth={roadProp.laneBorderWidth}
                        carProps={roadProp.carProps}
                    />
                </div>
            );
        });

        return (
            <div className="traffic" style={trafficStyle}>
                {roads}
            </div>
        );
    }
}

export default TrafficPage;