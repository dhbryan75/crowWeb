import React from "react";

import { delay, randomBool, randomInt } from "../../Assets/Functions";

import Road from "./Road";
import Connection from "./Connection";
import { RoadInfo, CarInfo, TrafficLightInfo, ConnectionInfo } from "./TrafficInfo";
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
        -100, 800, 
        800, -100, 
        0, 
        3, 
        90, 
        8,
        40,
        2,
    ),
    new RoadInfo(
        1000, 300, 
        700, 400,
        20, 
        3,
        90,
        8,
        40,
        2,
    ),
    new RoadInfo(
        400, 900, 
        300, 1400, 
        20, 
        3, 
        90, 
        8,
        40,
        2,
    ),
];

var connectionInfos = [
    new ConnectionInfo(
        roadInfos[1].laneInfos[2], 
        roadInfos[2].laneInfos[0],
    ),
];

var carInfos = [];

var trafficLightInfos = [
    new TrafficLightInfo(
        roadInfos[0].laneInfos[0],
        700,
        500,
        0,
        200,
    ),
    new TrafficLightInfo(
        roadInfos[0].laneInfos[1],
        700,
        500,
        0,
        200,
    ),
    new TrafficLightInfo(
        roadInfos[0].laneInfos[2],
        700,
        500,
        0,
        200,
    ),
];



const generateCar = () => {
    if(randomBool(0.13)) {
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
            return <Road roadInfo={roadInfo}/>
        });

        const connections = connectionInfos.map(connectionInfo => {
            return <Connection connectionInfo={connectionInfo}/>
        });

        return (
            <div className="traffic" style={trafficStyle}>
                {connections}
                {roads}
            </div>
        );
    }
}

export default TrafficPage;