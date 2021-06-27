import React from "react";

import { delay, randomBool, randomInt } from "../../Assets/Functions";

import Road from "./Road";
import { RoadInfo, CarInfo, TrafficLightInfo } from "./TrafficInfo";
import "./style.css";



const basicCarProps = [
    {
        name: "whiteCar",
        length: 70,
        breadth: 28,
        colors: {body: "#eee"},
        a: 25,
        d: 1,
        b: 40,
        maxV: 70,
        laneChangeV: 0.3,
        safeDistance: 120,
        dangerDistance: 90,
        initV: 30,
    }, 
    {
        name: "yellowCar",
        length: 70,
        breadth: 28,
        colors: {body: "#ff8"},
        a: 25,
        d: 1,
        b: 40,
        maxV: 70,
        laneChangeV: 0.3,
        safeDistance: 120,
        dangerDistance: 90,
        initV: 30,
    }, 
    {
        name: "greenCar",
        length: 70,
        breadth: 28,
        colors: {body: "#8f8"},
        a: 25,
        d: 1,
        b: 40,
        maxV: 70,
        laneChangeV: 0.3,
        safeDistance: 120,
        dangerDistance: 90,
        initV: 30,
    }, 
    {
        name: "grayTruck",
        length: 90,
        breadth: 29,
        colors: {body: "#bbb"},
        a: 20,
        d: 1,
        b: 40,
        maxV: 60,
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
        b: 40,
        maxV: 55,
        laneChangeV: 0.15,
        safeDistance: 90,
        dangerDistance: 60,
        initV: 30,
    }, 
];


var roadInfos = [
    new RoadInfo(
        -100, -100, 
        800, 1200,
        10, 
        4,
        90,
        8,
        40,
        2
    ),
    new RoadInfo(
        -100, 800, 
        800, -100, 
        0, 
        2, 
        90, 
        8,
        40,
        2,
    ),
];

var carInfos = [];

var trafficLightInfos = [
    new TrafficLightInfo(
        roadInfos[0].laneInfos[0],
        650,
        500,
        0,
        200,
    ),
    new TrafficLightInfo(
        roadInfos[0].laneInfos[1],
        650,
        500,
        0,
        200,
    ),
    new TrafficLightInfo(
        roadInfos[0].laneInfos[2],
        650,
        500,
        0,
        200,
    ),
    new TrafficLightInfo(
        roadInfos[0].laneInfos[3],
        650,
        500,
        0,
        200,
    ),
];



const generateCar = () => {
    if(randomBool(0.07)) {
        let roadInfo = roadInfos[randomInt(0, roadInfos.length)];
        let laneInfo = roadInfo.laneInfos[randomInt(0, roadInfo.laneInfos.length)];
        let carProp = basicCarProps[randomInt(0, basicCarProps.length)];
        carInfos.push(new CarInfo(
            laneInfo, 
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
};


const progress = () => {
    generateCar();

    carInfos.forEach(carInfo => {
        carInfo.progress();
    });
    trafficLightInfos.forEach(trafficLightInfo => {
        trafficLightInfo.progress();
    });
    roadInfos.forEach(roadInfo => {
        roadInfo.reset();
    });
    carInfos.forEach(carInfo => {
        carInfo.registerCar();
    });

    for(let i=carInfos.length-1; i>=0; i--) {
        if(carInfos[i].isRemoved()) {
            carInfos.splice(i, 1);
        }
    }
};


class TrafficPage extends React.Component {
    state = {
        roadInfos: [],
    }

    init = () => {}

    animate = async() => {
        for(let iteration = 0; iteration<40000; iteration++) {
            progress();
            this.setState({
                ...this.state,
                roadInfos: roadInfos,
            });
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
        const { roadInfos } = this.state;

        const trafficStyle = {
            width: width,
            height: height,
        }

        const roads = roadInfos.map(roadInfo => {
            const roadContainerStyle = {
                position: "absolute",
                left: roadInfo.center.x - roadInfo.length / 2,
                top: roadInfo.center.y - roadInfo.breadth / 2,
                transform: `rotate(${roadInfo.angle}rad)`,
                zIndex: roadInfo.zIndex,
                opacity: roadInfo.isSelected ? 0.7 : 1,
                transition: ".5s",
            };

            return (
                <div
                    className="roadContainer"
                    style={roadContainerStyle}
                    onClick={roadInfo.toggleIsSelected}
                >
                    <Road roadInfo={roadInfo}/>
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