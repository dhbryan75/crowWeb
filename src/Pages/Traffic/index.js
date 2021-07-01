import React from "react";

import { Vector } from "../../Assets/Physic2D";
import { delay } from "../../Assets/Functions";

import Road from "./Road";
import Conn from "./Conn";
import Car from "./Car";
import Control from "./Control";
import { RoadInfo, CarGenInfo, ControlInfo, ConnInfo } from "./TrafficInfo";


const dt = 0.1;
const interval = 15;
const refreshPeriod = 60 * 60 * 1000;

var screenCenter = new Vector(0, 0);
var screenV = new Vector(0, 0);
const screenMoveSpeed = 10;

var roadInfos = [
    new RoadInfo(
        -400, -100, 
        -900, -100, 
        0, 
        2,
        90, 
        8,
        40,
        2,
    ),
    new RoadInfo(
        -900, 0, 
        -400, 0,
        0, 
        2,
        90,
        8,
        40,
        2,
    ),
    new RoadInfo(
        400, -700, 
        0, -300, 
        0, 
        2, 
        90, 
        8,
        40,
        2,
    ),
    new RoadInfo(
        100, -200, 
        500, -600, 
        0, 
        2, 
        90, 
        8,
        40,
        2,
    ),
    new RoadInfo(
        -100, 200, 
        -100, 800, 
        0, 
        2, 
        90, 
        8,
        40,
        2,
    ),
    new RoadInfo(
        0, 800, 
        0, 200, 
        0, 
        2, 
        90, 
        8,
        40,
        2,
    ),
];

var connInfos = [
    new ConnInfo(
        roadInfos[1].laneInfos[0], 
        roadInfos[3].laneInfos[0],
    ),
    new ConnInfo(
        roadInfos[1].laneInfos[1], 
        roadInfos[4].laneInfos[1],
    ),
    new ConnInfo(
        roadInfos[2].laneInfos[0], 
        roadInfos[4].laneInfos[0],
    ),
    new ConnInfo(
        roadInfos[2].laneInfos[1], 
        roadInfos[0].laneInfos[1],
    ),
    new ConnInfo(
        roadInfos[5].laneInfos[0], 
        roadInfos[0].laneInfos[0],
    ),
    new ConnInfo(
        roadInfos[5].laneInfos[1], 
        roadInfos[3].laneInfos[1],
    ),
];

var carInfos = [];

var controlInfos = [
    new ControlInfo(
        connInfos[0],
        0,
        900,
        0,
        640,
    ),
    new ControlInfo(
        connInfos[2],
        0,
        900,
        300,
        640,
    ),
    new ControlInfo(
        connInfos[4],
        0,
        900,
        600,
        640,
    ),
];


var carGenInfos = [
    new CarGenInfo(
        roadInfos[1].laneInfos[0],
        0.01,
    ),
    new CarGenInfo(
        roadInfos[1].laneInfos[1],
        0.01,
    ),
    new CarGenInfo(
        roadInfos[2].laneInfos[0],
        0.01,
    ),
    new CarGenInfo(
        roadInfos[2].laneInfos[1],
        0.01,
    ),
    new CarGenInfo(
        roadInfos[5].laneInfos[0],
        0.01,
    ),
    new CarGenInfo(
        roadInfos[5].laneInfos[1],
        0.01,
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
    connInfos.forEach(connInfo => {
        connInfo.reset();
    })
    carInfos.forEach(carInfo => {
        carInfo.registerCar();
    });

    for(let i=carInfos.length-1; i>=0; i--) {
        if(carInfos[i].isRemoved()) {
            carInfos.splice(i, 1);
        }
    }

    screenCenter = screenCenter.add(screenV);
};

const onKeyDown = e => {
    if(e.code === "KeyW") {
        screenV = screenV.add(new Vector(0, screenMoveSpeed));
    } 
    else if(e.code === "KeyA") {
        screenV = screenV.add(new Vector(screenMoveSpeed, 0));
    } 
    else if(e.code === "KeyS") {
        screenV = screenV.add(new Vector(0, -screenMoveSpeed));
    }
    else if(e.code === "KeyD") {
        screenV = screenV.add(new Vector(-screenMoveSpeed, 0));
    }
    else {
        console.log(e);
    }
}

const onKeyUp = e => {
    if(e.code === "KeyW") {
        screenV = screenV.add(new Vector(0, -screenMoveSpeed));
    } 
    else if(e.code === "KeyA") {
        screenV = screenV.add(new Vector(-screenMoveSpeed, 0));
    } 
    else if(e.code === "KeyS") {
        screenV = screenV.add(new Vector(0, screenMoveSpeed));
    }
    else if(e.code === "KeyD") {
        screenV = screenV.add(new Vector(screenMoveSpeed, 0));
    }
    else {
        console.log(e);
    }
}


class TrafficPage extends React.Component {
    state = {
        roadInfos: roadInfos,
        connInfos: connInfos,
        carInfos: carInfos,
        controlInfos: controlInfos,
        screenCenter: screenCenter,
    };

    init = () => {
        document.addEventListener('keydown', onKeyDown);
        document.addEventListener('keyup', onKeyUp); 
    }

    animate = async() => {
        for(let iteration = 0; iteration<refreshPeriod/interval; iteration++) {
            progress();
            this.setState({
                ...this.state,
                roadInfos: roadInfos,
                connInfos: connInfos,
                carInfos: carInfos,
                controlInfos: controlInfos,
                screenCenter: screenCenter,
            });
            await delay(interval);
        }
        window.location.reload();
    }

    componentDidMount() {
        this.init();
        this.animate();
    }

    render() {
        const { width, height } = this.props;
        const { roadInfos, connInfos, carInfos, controlInfos, screenCenter } = this.state;
        if(!screenCenter) return null;

        const trafficStyle = {
            position: "absolute",
            left: screenCenter.x + width / 2,
            top: screenCenter.y + height / 2,
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
            <div 
                className="traffic" 
                style={trafficStyle}
            >
                {roads}
                {/*conns*/}
                {cars}
                {controls}
            </div>
        );
    }
}

export default TrafficPage;