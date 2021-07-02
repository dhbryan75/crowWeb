import React from "react";

import { Vector } from "../../Assets/Physic2D";
import { delay } from "../../Assets/Functions";

import Road from "./Road";
import Conn from "./Conn";
import Car from "./Car";
import Control from "./Control";
import { roadInfos, connInfos, carInfos, controlInfos, carGenInfos } from "./Intersection";


const dt = 0.1;
const interval = 15;
const refreshPeriod = 60 * 60 * 1000;

var screenCenter = new Vector(0, 0);
var screenV = new Vector(0, 0);
const screenMoveSpeed = 10;



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

    for(let i = carInfos.length - 1; i >= 0; i--) {
        if(carInfos[i].isRemoved()) {
            carInfos.splice(i, 1);
        }
    }

    screenCenter = screenCenter.add(screenV);
};



var isMouseDown = false;
const onMouseDown = e => {
    if(e.button === 0) {
        isMouseDown = true;
    }
}

const onMouseUp = e => {
    if(e.button === 0) {
        isMouseDown = false;
    }
}

const onMouseMove = e => {
    if(!isMouseDown) return;
    let d = new Vector(e.movementX, e.movementY);
    screenCenter = screenCenter.add(d);
}



var downKeys = [];
const onKeyDown = e => {
    if(downKeys.includes(e.code)) {
        return;
    }
    downKeys.push(e.code);

    if(e.code === "KeyW" || e.code === "ArrowUp") {
        screenV = screenV.add(new Vector(0, screenMoveSpeed));
    } 
    else if(e.code === "KeyA" || e.code === "ArrowLeft") {
        screenV = screenV.add(new Vector(screenMoveSpeed, 0));
    } 
    else if(e.code === "KeyS" || e.code === "ArrowDown") {
        screenV = screenV.add(new Vector(0, -screenMoveSpeed));
    }
    else if(e.code === "KeyD" || e.code === "ArrowRight") {
        screenV = screenV.add(new Vector(-screenMoveSpeed, 0));
    }
    else {
        console.log(e);
    }
}

const onKeyUp = e => {
    let idx = downKeys.findIndex(key => (key === e.code));
    if(idx === undefined) {
        return;
    }
    downKeys.splice(idx, 1);

    if(e.code === "KeyW" || e.code === "ArrowUp") {
        screenV = screenV.add(new Vector(0, -screenMoveSpeed));
    } 
    else if(e.code === "KeyA" || e.code === "ArrowLeft") {
        screenV = screenV.add(new Vector(-screenMoveSpeed, 0));
    } 
    else if(e.code === "KeyS" || e.code === "ArrowDown") {
        screenV = screenV.add(new Vector(0, screenMoveSpeed));
    }
    else if(e.code === "KeyD" || e.code === "ArrowRight") {
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
        document.addEventListener('mousedown', onMouseDown);
        document.addEventListener('mouseup', onMouseUp);
        document.addEventListener('mousemove', onMouseMove);
    }

    animate = async() => {
        for(let iteration = 0; iteration < (refreshPeriod / interval); iteration++) {
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

        const backgroundStyle = {
            position: "fixed",
            left: 0,
            top: 0,
            width: width,
            height: height,
            background: "#ada",
            zIndex: -999,
        }

        const screenStyle = {
            position: "absolute",
            left: screenCenter.x + width / 2,
            top: screenCenter.y + height / 2,
            zIndex: 0,
        }

        const interfaceStyle = {
            position: "fixed",
            left: 0,
            top: 0,
            width: width,
            height: height,
            zIndex: 999,
        }

        const roads = roadInfos.map(roadInfo => {
            return <Road key={roadInfo.id} roadInfo={roadInfo}/>
        });

        const conns = connInfos.map(connInfo => {
            return <Conn key={connInfo.id} connInfo={connInfo}/>
        });

        const cars = carInfos.filter(carInfo => {
            return !carInfo.isQueued();
        }).map(carInfo => {
            return <Car key={carInfo.id} carInfo={carInfo}/>
        });

        const controls = controlInfos.map(controlInfo => {
            return <Control key={controlInfo.id} controlInfo={controlInfo}/>
        });

        return (
            <div className="traffic">
                <div className="background" style={backgroundStyle}/>
                <div className="screen" style={screenStyle}>
                    {conns}
                    {roads}
                    {cars}
                    {controls}
                </div>
                <div className="interface" style={interfaceStyle}>
                </div>
            </div>
        );
    }
}

export default TrafficPage;