import React from "react";

import { delay } from "../../Assets/Functions";

import Road from "./Road";
import Conn from "./Conn";
import Car from "./Car";
import Control from "./Control";
import { RoadInfo, CarGenInfo, ControlInfo, ConnInfo } from "./TrafficInfo";
import "./style.css";


const dt = 0.1;

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

var connInfos = [
    new ConnInfo(
        roadInfos[1].laneInfos[2], 
        roadInfos[2].laneInfos[0],
    ),
];

var carInfos = [];

var controlInfos = [
    new ControlInfo(
        roadInfos[0].laneInfos[0],
        700,
        500,
        0,
        200,
    ),
    new ControlInfo(
        roadInfos[0].laneInfos[1],
        700,
        500,
        0,
        200,
    ),
    new ControlInfo(
        roadInfos[0].laneInfos[2],
        700,
        500,
        0,
        200,
    ),
];


var carGenInfos = [
    new CarGenInfo(
        roadInfos[0].laneInfos[0],
        0.02,
    ),
    new CarGenInfo(
        roadInfos[0].laneInfos[1],
        0.01,
    ),
    new CarGenInfo(
        roadInfos[0].laneInfos[2],
        0.02,
    ),
    new CarGenInfo(
        roadInfos[1].laneInfos[2],
        0.1,
    ),
];


const progress = () => {
    carGenInfos.forEach(carGenInfo => {
        carGenInfo.generateCar(carInfos);
    });
    carInfos.forEach(carInfo => {
        carInfo.progress(dt);
    });
    controlInfos.forEach(controlInfo => {
        controlInfo.progress();
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
        roadInfos: roadInfos,
        connInfos: connInfos,
        carInfos: carInfos,
        controlInfos: controlInfos,
    };

    init = () => {}

    animate = async() => {
        for(let iteration = 0; iteration<40000; iteration++) {
            progress();
            this.setState({
                ...this.state,
                roadInfos: roadInfos,
                connInfos: connInfos,
                carInfos: carInfos,
                controlInfos: controlInfos,
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
        const { roadInfos, connInfos, carInfos, controlInfos } = this.state;

        const trafficStyle = {
            width: width,
            height: height,
        }

        const roads = roadInfos.map(roadInfo => {
            return <Road roadInfo={roadInfo}/>
        });

        const conns = connInfos.map(connInfo => {
            return <Conn connInfo={connInfo}/>
        });

        const cars = carInfos.filter(carInfo => {
            return !carInfo.isQueued();
        }).map(carInfo => {
            return <Car carInfo={carInfo}/>
        });

        const controls = controlInfos.map(controlInfo => {
            return <Control controlInfo={controlInfo}/>
        });

        return (
            <div className="traffic" style={trafficStyle}>
                {roads}
                {conns}
                {cars}
                {controls}
            </div>
        );
    }
}

export default TrafficPage;