import React from "react";

import { Vector } from "../../Assets/Physic2D";
import { delay } from "../../Assets/Functions";

import Button from "../../Components/Button";
import Input from "../../Components/Input";
import Toggle from "../../Components/Toggle";
import Road from "./Road";
import Conn from "./Conn";
import Car from "./Car";
import Control from "./Control";

import { roadInfos, connInfos, carInfos, controlInfos, carGenInfos } from "./Intersection";
import { RoadInfo, ConnInfo, CarGenInfo, ControlInfo, LaneInfo } from "./TrafficInfo";



const dt = 0.15;
const interval = 15;
const refreshPeriod = 60 * 60 * 1000;

var screenWidth;
var screenHeight;
var screenCenter = new Vector(0, 0);
var screenV = new Vector(0, 0);
const screenMoveSpeed = 10;



var isShowRoadOn = true;
var isShowConnOn = true;
var isShowControlOn = true;
var isShowCarOn = true;



const NORMAL = 0;
const ADDROAD = 1;
const ADDCONN = 2;
const ADDLANECONTROL = 3;
const ADDCONNCONTROL = 4;
const ADDCARGEN = 5;
const REMOVEROAD = 6;
const REMOVECONN = 7;
const REMOVECONTROL = 8;
const REMOVECARGEN = 9;

var currMode = NORMAL;

const roadMinLength = 100;
const markerSize = 40;
var roadStart;
var roadEnd;


const removeConn = id => {
    for(let i=controlInfos.length-1; i>=0; i--) {
        if(!!controlInfos[i].connInfo && controlInfos[i].connInfo.id === id) {
            controlInfos.splice(i, 1);
        }
    }
    for(let i=carInfos.length-1; i>=0; i--) {
        if(carInfos[i].isOnConn() && carInfos[i].connInfo.id === id) {
            carInfos.splice(i, 1);
        }
        else if(carInfos[i].isOnRoad() && !!carInfos[i].destConnInfo && carInfos[i].destConnInfo.id === id) {
            carInfos.splice(i, 1);
        }
    }
    roadInfos.forEach(roadInfo => {
        roadInfo.laneInfos.forEach(laneInfo => {
            for(let i=laneInfo.prevInfos.length-1; i>=0; i--) {
                if(laneInfo.prevInfos[i].id === id) {
                    laneInfo.prevInfos.splice(i, 1);
                }
            }
            for(let i=laneInfo.nextInfos.length-1; i>=0; i--) {
                if(laneInfo.nextInfos[i].id === id) {
                    laneInfo.nextInfos.splice(i, 1);
                }
            }
        });
    });
    let idx = connInfos.findIndex(connInfo => connInfo.id === id);
    connInfos.splice(idx, 1);
};

var modes = [];
modes[NORMAL] = {
    idx: NORMAL,
    key: "normal", 
    name: "일반",
    onClick: e => {
        currMode = NORMAL;
        modes[currMode].message = "";
    },
    inputs: [],
    toggles: [
        {
            key: "showRoad",
            name: "도로 표시",
            type: "checkbox",
            value: isShowRoadOn,
            onChange: e => {
                isShowRoadOn = e.target.checked;
            }
        },
        {
            key: "showConn",
            name: "연결 표시",
            type: "checkbox",
            value: isShowConnOn,
            onChange: e => {
                isShowConnOn = e.target.checked;
            }
        },
        {
            key: "showControl",
            name: "신호 표시",
            type: "checkbox",
            value: isShowControlOn,
            onChange: e => {
                isShowControlOn = e.target.checked;
            }
        },
        {
            key: "showCar",
            name: "차량 표시",
            type: "checkbox",
            value: isShowCarOn,
            onChange: e => {
                isShowCarOn = e.target.checked;
            }
        },
    ],
    buttons: [],
    isMouseOver: false,
    desc: "",
    message: "",
};
modes[ADDROAD] = {
    idx: ADDROAD,
    key: "addRoad",
    name: "도로 추가",
    onClick: e => {
        currMode = ADDROAD;
        roadStart = null;
        roadEnd = null;
        modes[currMode].message = "";
    },
    inputs: [
        {
            key: "zIndex",
            name: "높이",
            type: "number",
            value: 1,
        },
        {
            key: "lane",
            name: "차선 수",
            type: "number",
            value: 1,
        },
        {
            key: "speedLimit",
            name: "제한속도",
            type: "number",
            value: 100,
        },
    ],
    toggles: [],
    buttons: [
        {
            key: "add",
            name: "추가",
            onClick: e => {
                if(!roadStart) {
                    modes[currMode].message = "시작점이 지정되지 않았습니다.";
                    return;
                }
                if(!roadEnd) {
                    modes[currMode].message = "끝점이 지정되지 않았습니다.";
                    return;
                }
                if(Vector.dist(roadStart, roadEnd) < roadMinLength) {
                    modes[currMode].message = "도로가 너무 짧습니다.";
                    return;
                }
                let inputs = modes[currMode].inputs;
                roadInfos.push(new RoadInfo(
                    roadStart.x, 
                    roadStart.y, 
                    roadEnd.x, 
                    roadEnd.y, 
                    parseInt(inputs[0].value) * 10,
                    parseInt(inputs[1].value),
                    parseInt(inputs[2].value),
                ));
                roadStart = null;
                roadEnd = null;
                modes[currMode].message = "도로가 추가되었습니다.";
            },
        },
    ],
    isMouseOver: false,
    desc: "두 지점을 클릭하고 추가 버튼을 누르세요.",
    message: "",
};
modes[ADDCONN] = {
    idx: ADDCONN,
    key: "addConn",
    name: "연결 추가",
    select: "lane",
    onClick: e => {
        currMode = ADDCONN;
        LaneInfo.selected = [];
        modes[currMode].message = "";
    },
    inputs: [],
    toggles: [],
    buttons: [
        {
            key: "clear",
            name: "전체 선택해제",
            onClick: e => {
                LaneInfo.selected = [];
            },
            isMouseOver: false,
        },
        {
            key: "add",
            name: "추가",
            onClick: e => {
                if(LaneInfo.selected.length < 2) {
                    modes[currMode].message = "차선을 2개 선택해주세요.";
                    return;
                }
                LaneInfo.selected = LaneInfo.selected.slice(-2);
                if(LaneInfo.selected[0].roadInfo.id === LaneInfo.selected[1].roadInfo.id) {
                    modes[currMode].message = "같은 도로에 있는 차선은 연결할 수 없습니다.";
                    return;
                }
                let connInfo = connInfos.find(connInfo => {
                    return connInfo.prevInfo.id === LaneInfo.selected[0].id && connInfo.nextInfo.id === LaneInfo.selected[1].id;
                })
                if(!!connInfo) {
                    modes[currMode].message = "선택된 차선에 해당되는 연결이 이미 있습니다.";
                    return;
                }

                connInfos.push(new ConnInfo(LaneInfo.selected[0], LaneInfo.selected[1]));
                LaneInfo.selected = [];
                modes[currMode].message = "연결이 추가되었습니다.";
            },
            isMouseOver: false,
        },
    ],
    isMouseOver: false,
    desc: "연결할 차선 2개를 선택하고 추가 버튼을 누르세요.",
    message: "",
};
modes[ADDLANECONTROL] = {
    idx: ADDLANECONTROL,
    key: "addLaneControl",
    name: "차선신호 추가",
    select: "lane",
    onClick: e => {
        currMode = ADDLANECONTROL;
        LaneInfo.selected = [];
        modes[currMode].message = "";
    },
    inputs: [
        {
            key: "x",
            name: "위치",
            type: "number",
            value: 0,
        },
        {
            key: "period",
            name: "주기",
            type: "number",
            value: 500,
        },
        {
            key: "delay",
            name: "딜레이",
            type: "number",
            value: 0,
        },
        {
            key: "duration",
            name: "통제시간",
            type: "number",
            value: 300,
        },
    ],
    toggles: [],
    buttons: [
        {
            key: "clear",
            name: "전체 선택해제",
            onClick: e => {
                LaneInfo.selected = [];
            },
            isMouseOver: false,
        },
        {
            key: "add",
            name: "추가",
            onClick: e => {
                if(LaneInfo.selected.length === 0) {
                    modes[currMode].message = "차선을 선택해주세요.";
                    return;
                }
                let inputs = modes[currMode].inputs;
                LaneInfo.selected.forEach(laneInfo => {
                    controlInfos.push(new ControlInfo(
                        laneInfo, 
                        parseInt(inputs[0].value), 
                        parseInt(inputs[1].value), 
                        parseInt(inputs[2].value), 
                        parseInt(inputs[3].value),
                    ));
                });
                LaneInfo.selected = [];
                modes[currMode].message = "신호가 추가되었습니다.";
            },
            isMouseOver: false,
        },
    ],
    isMouseOver: false,
    desc: "신호를 추가할 차선을 선택하고 추가 버튼을 누르세요.",
    message: "",
};
modes[ADDCONNCONTROL] = {
    idx: ADDCONNCONTROL,
    key: "addConnControl",
    name: "연결신호 추가",
    select: "lane",
    onClick: e => {
        currMode = ADDCONNCONTROL;
        LaneInfo.selected = [];
        modes[currMode].message = "";
    },
    inputs: [
        {
            key: "period",
            name: "주기",
            type: "number",
            value: 500,
        },
        {
            key: "delay",
            name: "딜레이",
            type: "number",
            value: 0,
        },
        {
            key: "duration",
            name: "통제시간",
            type: "number",
            value: 300,
        },
    ],
    toggles: [],
    buttons: [
        {
            key: "clear",
            name: "전체 선택해제",
            onClick: e => {
                LaneInfo.selected = [];
            },
            isMouseOver: false,
        },
        {
            key: "add",
            name: "추가",
            onClick: e => {
                if(LaneInfo.selected.length < 2) {
                    modes[currMode].message = "차선을 2개 선택해주세요.";
                    return;
                }
                LaneInfo.selected = LaneInfo.selected.slice(-2);
                let connInfo = connInfos.find(connInfo => {
                    return connInfo.prevInfo.id === LaneInfo.selected[0].id && connInfo.nextInfo.id === LaneInfo.selected[1].id;
                })
                if(!connInfo) {
                    modes[currMode].message = "선택된 차선에 해당되는 연결이 없습니다.";
                    return;
                }

                let inputs = modes[currMode].inputs;
                controlInfos.push(new ControlInfo(
                    connInfo, 
                    0,
                    parseInt(inputs[0].value), 
                    parseInt(inputs[1].value), 
                    parseInt(inputs[2].value),
                ));
                LaneInfo.selected = [];
                modes[currMode].message = "신호가 추가되었습니다."
            },
            isMouseOver: false,
        },
    ],
    isMouseOver: false,
    desc: "신호를 추가할 연결의 앞뒤 차선을 순서대로 선택하고 추가 버튼을 누르세요.",
    message: "",
};
modes[ADDCARGEN] = {
    idx: ADDCARGEN,
    key: "addCarGen",
    name: "차량생성 추가",
    select: "lane",
    onClick: e => {
        currMode = ADDCARGEN;
        LaneInfo.selected = [];
        modes[currMode].message = "";
    },
    inputs: [
        {
            key: "prob",
            name: "틱당 생성 확률",
            type: "number",
            step: 0.001,
            value: 0.005,
        },
    ],
    toggles: [],
    buttons: [
        {
            key: "clear",
            name: "전체 선택해제",
            onClick: e => {
                LaneInfo.selected = [];
            },
            isMouseOver: false,
        },
        {
            key: "add",
            name: "추가",
            onClick: e => {
                if(LaneInfo.selected.length === 0) {
                    modes[currMode].message = "차선을 선택해주세요.";
                    return;
                }
                let inputs = modes[currMode].inputs;
                LaneInfo.selected.forEach(laneInfo => {
                    let idx = carGenInfos.findIndex(carGenInfo => carGenInfo.laneInfo.id === laneInfo.id);
                    if(idx !== -1) {
                        carGenInfos.splice(idx, 1);
                    }
                    carGenInfos.push(new CarGenInfo(
                        laneInfo,
                        parseFloat(inputs[0].value),
                    ));
                });
                LaneInfo.selected = [];
                modes[currMode].message = "차량생성이 추가되었습니다.";
            },
            isMouseOver: false,
        },
    ],
    isMouseOver: false,
    desc: "차량생성을 추가할 차선을 선택하고 추가 버튼을 누르세요.",
    message: "",
};
modes[REMOVEROAD] = {
    idx: REMOVEROAD,
    key: "removeRoad",
    name: "도로 제거",
    select: "road",
    onClick: e => {
        currMode = REMOVEROAD;
        RoadInfo.selected = [];
        modes[currMode].message = "";
    },
    inputs: [],
    toggles: [],
    buttons: [
        {
            key: "clear",
            name: "전체 선택해제",
            onClick: e => {
                RoadInfo.selected = [];
            },
            isMouseOver: false,
        },
        {
            key: "remove",
            name: "제거",
            onClick: e => {
                if(RoadInfo.selected.length === 0) {
                    modes[currMode].message = "도로를 선택해주세요.";
                    return;
                }
                for(let i=controlInfos.length-1; i>=0; i--) {
                    if(!!controlInfos[i].roadInfo && controlInfos[i].roadInfo.isSelected()) {
                        controlInfos.splice(i, 1);
                    }
                }
                for(let i=carInfos.length-1; i>=0; i--) {
                    if(carInfos[i].isOnRoad() && carInfos[i].roadInfo.isSelected()) {
                        carInfos.splice(i, 1);
                    }
                }
                for(let i=carGenInfos.length-1; i>=0; i--) {
                    if(carGenInfos[i].roadInfo.isSelected()) {
                        carGenInfos.splice(i, 1);
                    }
                }
                for(let i=connInfos.length-1; i>=0; i--) {
                    let connInfo = connInfos[i];
                    if(connInfo.prevInfo.roadInfo.isSelected() || connInfo.nextInfo.roadInfo.isSelected()) {
                        removeConn(connInfo.id);
                    }
                }
                for(let i=roadInfos.length-1; i>=0; i--) {
                    if(roadInfos[i].isSelected()) {
                        roadInfos.splice(i, 1);
                    }
                }
                RoadInfo.selected = [];
                modes[currMode].message = "도로가 제거되었습니다.";
            },
            isMouseOver: false,
        },
    ],
    isMouseOver: false,
    desc: "제거할 도로를 선택하고 제거 버튼을 누르세요.",
    message: "",
};
modes[REMOVECONN] = {
    idx: REMOVECONN,
    key: "removeConn",
    name: "연결 제거",
    select: "lane",
    onClick: e => {
        currMode = REMOVECONN;
        LaneInfo.selected = [];
        modes[currMode].message = "";
    },
    inputs: [],
    toggles: [],
    buttons: [
        {
            key: "clear",
            name: "전체 선택해제",
            onClick: e => {
                LaneInfo.selected = [];
            },
            isMouseOver: false,
        },
        {
            key: "remove",
            name: "제거",
            onClick: e => {
                if(LaneInfo.selected.length < 2) {
                    modes[currMode].message = "차선을 2개 선택해주세요.";
                    return;
                }
                LaneInfo.selected = LaneInfo.selected.slice(-2);
                let connInfo = connInfos.find(connInfo => {
                    return connInfo.prevInfo.id === LaneInfo.selected[0].id && connInfo.nextInfo.id === LaneInfo.selected[1].id;
                })
                if(!connInfo) {
                    modes[currMode].message = "선택된 차선에 해당되는 연결이 없습니다.";
                    return;
                }

                removeConn(connInfo.id);
                LaneInfo.selected = [];
                modes[currMode].message = "연결이 제거되었습니다.";
            },
            isMouseOver: false,
        },
    ],
    isMouseOver: false,
    desc: "제거할 연결의 앞뒤 차선을 순서대로 선택하고 제거 버튼을 누르세요.",
    message: "",
};
modes[REMOVECONTROL] = {
    idx: REMOVECONTROL,
    key: "removeControl",
    name: "신호 제거",
    select: "control",
    onClick: e => {
        currMode = REMOVECONTROL;
        ControlInfo.selected = [];
        modes[currMode].message = "";
    },
    inputs: [],
    toggles: [],
    buttons: [
        {
            key: "clear",
            name: "전체 선택해제",
            onClick: e => {
                ControlInfo.selected = [];
            },
            isMouseOver: false,
        },
        {
            key: "remove",
            name: "제거",
            onClick: e => {
                if(ControlInfo.selected.length === 0) {
                    modes[currMode].message = "신호를 선택해주세요.";
                    return;
                }

                for(let i=controlInfos.length-1; i>=0; i--) {
                    if(controlInfos[i].isSelected()) {
                        if(!!controlInfos[i].laneInfo) {
                            let idx = controlInfos[i].laneInfo.controlInfos.findIndex(controlInfo => controlInfo.id === controlInfos[i].id);
                            controlInfos[i].laneInfo.controlInfos.splice(idx, 1);
                        }
                        else {
                            let idx = controlInfos[i].connInfo.controlInfos.findIndex(controlInfo => controlInfo.id === controlInfos[i].id);
                            controlInfos[i].connInfo.controlInfos.splice(idx, 1);
                        }
                        controlInfos.splice(i, 1);
                    }
                }
                ControlInfo.selected = [];
                modes[currMode].message = "신호가 제거되었습니다.";
            },
            isMouseOver: false,
        },
    ],
    isMouseOver: false,
    desc: "제거할 신호를 선택하고 제거 버튼을 누르세요.",
    message: "",
};
modes[REMOVECARGEN] = {
    idx: REMOVECARGEN,
    key: "removeCarGen",
    name: "차량생성 제거",
    select: "lane",
    onClick: e => {
        currMode = REMOVECARGEN;
        LaneInfo.selected = [];
        modes[currMode].message = "";
    },
    inputs: [],
    toggles: [],
    buttons: [
        {
            key: "clear",
            name: "전체 선택해제",
            onClick: e => {
                LaneInfo.selected = [];
            },
            isMouseOver: false,
        },
        {
            key: "remove",
            name: "제거",
            onClick: e => {
                if(LaneInfo.selected.length === 0) {
                    modes[currMode].message = "신호를 선택해주세요.";
                    return;
                }

                for(let i=carGenInfos.length-1; i>=0; i--) {
                    if(carGenInfos[i].laneInfo.isSelected()) {
                        carGenInfos.splice(i, 1);
                    }
                }
                LaneInfo.selected = [];
                modes[currMode].message = "차량생성이 제거되었습니다.";
            },
            isMouseOver: false,
        },
    ],
    isMouseOver: false,
    desc: "차량생성을 제거할 차선을 선택하고 제거 버튼을 누르세요.",
    message: "",
};

class Interface extends React.Component {
    render() {
        const { width, height } = this.props;

        const interfaceStyle = {
            display: "flex",
        }

        const modeButtons = modes.map(mode => {
            const buttonContainerStyle = {
                width: "100%",
                height: 50,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            };
            const onMouseOver = e => {
                mode.isMouseOver = true;
            }
            const onMouseOut = e => {
                mode.isMouseOver = false;
            }
            let color = mode.idx === currMode ? "linear-gradient(#aaa, #fff)" : (mode.isMouseOver ? "linear-gradient(#999, #aaa)" : "linear-gradient(#aaa, #999)");
            let fontColor = "#000";
            return (
                <div className="buttonContainer" key={mode.key} style={buttonContainerStyle}>
                    <Button
                        width={150}
                        height={40}
                        borderRadius={10}
                        color={color}
                        fontColor={fontColor}
                        fontSize={15}
                        text={mode.name}
                        onClick={mode.onClick}
                        onMouseOver={onMouseOver}
                        onMouseOut={onMouseOut}
                    />
                </div>
            );
        })

        const inputs = modes[currMode].inputs.map(input => {
            const inputContainerStyle = {
                width: "100%",
                height: 50,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }

            const onChange = e => {
                input.value = e.target.value;
            }
            return (
                <div className="inputContainer" key={input.key} style={inputContainerStyle}>
                    <Input
                        keyWidth={100}
                        inputWidth={100}
                        height={40}
                        borderWidth={1}
                        borderRadius={10}
                        color="#222"
                        fontColor="#fff"
                        fontSize={15}
                        text={input.name}
                        type={input.type}
                        value={input.value}
                        step={input.step}
                        onChange={onChange}
                    />
                </div>
            );
        });

        const toggles = modes[currMode].toggles.map(toggle => {
            const toggleContainerStyle = {
                width: "100%",
                height: 50,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }

            const onChange = e => {
                toggle.value = e.target.checked;
                if(!!toggle.onChange) toggle.onChange(e);
            }

            return (
                <div className="toggleContainer" key={toggle.key} style={toggleContainerStyle}>
                    <Toggle
                        keyWidth={100}
                        toggleWidth={60}
                        height={40}
                        borderWidth={1}
                        borderRadius={10}
                        color="#000"
                        fontColor="#fff"
                        fontSize={15}
                        text={toggle.name}
                        type={toggle.type}
                        value={toggle.value}
                        onChange={onChange}
                    />
                </div>
            );
        });

        const buttons = modes[currMode].buttons.map(button => {
            const buttonContainerStyle = {
                width: "100%",
                height: 50,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }

            const onMouseOver = e => {
                button.isMouseOver = true;
            }
            const onMouseOut = e => {
                button.isMouseOver = false;
            }
            let color = button.isMouseOver ? "linear-gradient(#0a0, #0f0)" : "linear-gradient(#0f0, #0a0)";
            let fontColor = "#000";
            return (
                <div className="buttonContainer" key={button.key} style={buttonContainerStyle}>
                    <Button
                        width={150}
                        height={40}
                        borderRadius={10}
                        color={color}
                        fontColor={fontColor}
                        fontSize={15}
                        text={button.name}
                        onClick={button.onClick}
                        onMouseOver={onMouseOver}
                        onMouseOut={onMouseOut}
                    />
                </div>
            );
        });

        const flexStyle = {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
        };

        return (
            <div className="interface" style={interfaceStyle}>
                <div className="leftTab" style={{
                    width: 250,
                    height: height,
                    background: "#000a",
                    backdropFilter: "blur(3px)",
                    ...flexStyle,
                }}>
                    <div className="modes" style={{
                        flex: 9,
                        ...flexStyle,
                    }}>
                        {modeButtons}
                    </div>
                    <div className="desc" style={{
                        flex: 1,
                        padding: 20,
                        color: "#fff",
                        ...flexStyle,
                    }}>
                        {modes[currMode].desc}
                    </div>
                    <div className="options" style={{
                        flex: 4,
                        ...flexStyle,
                    }}>
                        {inputs}
                        {toggles}
                    </div>
                    <div className="buttons" style={{
                        flex: 2,
                        ...flexStyle,
                    }}>
                        {buttons}
                    </div>
                    <div className="message" style={{
                        flex: 1,
                        padding: 20,
                        color: "#fff",
                        ...flexStyle,
                    }}>
                        {modes[currMode].message}
                    </div>
                </div>
            </div>
        );
    }
}



var isMouseDown = false;
const onMouseDown = e => {
    if(e.button === 0) {
        isMouseDown = true;
        if(currMode === ADDROAD) {
            let p = new Vector(e.clientX, e.clientY).add(screenCenter).sub(new Vector(screenWidth / 2, screenHeight / 2));
            if(!roadStart) {
                roadStart = p;
            }
            else if(!roadEnd) {
                roadEnd = p;
            }
            else {
                roadStart = p;
                roadEnd = null;
            }
        }
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
    screenCenter = screenCenter.sub(d);
}

const onMouseOut = e => {
    isMouseDown = false;
}

var downKeys = [];
const onKeyDown = e => {
    if(downKeys.includes(e.code)) {
        return;
    }
    downKeys.push(e.code);

    if(e.code === "KeyW" || e.code === "ArrowUp") {
        screenV.move(new Vector(0, -screenMoveSpeed));
    } 
    else if(e.code === "KeyA" || e.code === "ArrowLeft") {
        screenV.move(new Vector(-screenMoveSpeed, 0));
    } 
    else if(e.code === "KeyS" || e.code === "ArrowDown") {
        screenV.move(new Vector(0, screenMoveSpeed));
    }
    else if(e.code === "KeyD" || e.code === "ArrowRight") {
        screenV.move(new Vector(screenMoveSpeed, 0));
    }
}

const onKeyUp = e => {
    let idx = downKeys.findIndex(key => (key === e.code));
    if(idx === -1) {
        return;
    }
    downKeys.splice(idx, 1);

    if(e.code === "KeyW" || e.code === "ArrowUp") {
        screenV.move(new Vector(0, screenMoveSpeed));
    } 
    else if(e.code === "KeyA" || e.code === "ArrowLeft") {
        screenV.move(new Vector(screenMoveSpeed, 0));
    } 
    else if(e.code === "KeyS" || e.code === "ArrowDown") {
        screenV.move(new Vector(0, -screenMoveSpeed));
    }
    else if(e.code === "KeyD" || e.code === "ArrowRight") {
        screenV.move(new Vector(-screenMoveSpeed, 0));
    }
}




const update = iteration => {
    carGenInfos.forEach(carGenInfo => {
        carGenInfo.generateCar(carInfos);
    });
    carInfos.forEach(carInfo => {
        carInfo.update(dt);
    });
    controlInfos.forEach(controlInfo => {
        controlInfo.update(iteration);
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

    screenCenter.move(screenV);
};



class TrafficPage extends React.Component {
    state = {
        roadInfos,
        connInfos,
        carInfos,
        controlInfos,
    };

    init = () => {
        document.addEventListener('keydown', onKeyDown);
        document.addEventListener('keyup', onKeyUp);
    }

    animate = async() => {
        for(let iteration = 0; iteration < (refreshPeriod / interval); iteration++) {
            update(iteration);
            this.setState({
                ...this.state,
                roadInfos,
                connInfos,
                carInfos,
                controlInfos,
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

        screenWidth = width;
        screenHeight = height;

        const { 
            roadInfos, 
            connInfos, 
            carInfos, 
            controlInfos, 
        } = this.state;

        const backgroundStyle = {
            position: "fixed",
            left: 0,
            top: 0,
            width: width,
            height: height,
            background: "#ada",
        }

        const screenStyle = {
            position: "absolute",
            left: width / 2 - screenCenter.x,
            top: height / 2 - screenCenter.y,
            zIndex: 0,
        }

        const roads = roadInfos.map(roadInfo => {
            return <Road 
                key={roadInfo.id} 
                roadInfo={roadInfo} 
                isSelecting={modes[currMode].select === "road"} 
                isSelectingLane={modes[currMode].select === "lane"}
            />
        });

        const conns = connInfos.map(connInfo => {
            return <Conn 
                key={connInfo.id} 
                connInfo={connInfo} 
                isSelecting={modes[currMode].select === "conn"}
            />
        });

        const cars = carInfos.filter(carInfo => {
            return !carInfo.isQueued();
        }).map(carInfo => {
            return <Car 
                key={carInfo.id} 
                carInfo={carInfo} 
                isSelecting={modes[currMode].select === "car"}
            />
        });

        const controls = controlInfos.map(controlInfo => {
            return <Control 
                key={controlInfo.id} 
                controlInfo={controlInfo} 
                isSelecting={modes[currMode].select === "control"}
            />
        });

        const markerStyle = {
            position: "absolute",
            width: markerSize,
            height: markerSize,
            borderRadius: "50%",
            background: "#000",
        }

        let startMarkerStyle;
        if(!!roadStart && currMode === ADDROAD) {
            startMarkerStyle = {
                ...markerStyle,
                left: roadStart.x - markerSize / 2,
                top: roadStart.y - markerSize / 2,
            }
        }
        
        let endMarkerStyle;
        if(!!roadEnd && currMode === ADDROAD) {
            endMarkerStyle = {
                ...markerStyle,
                left: roadEnd.x - markerSize / 2,
                top: roadEnd.y - markerSize / 2,
            }
        }

        return (
            <div className="traffic">
                <div 
                    className="screen"
                    onMouseDown={onMouseDown}
                    onMouseUp={onMouseUp}
                    onMouseMove={onMouseMove}
                    onMouseOut={onMouseOut}
                    style={screenStyle}
                >
                    <div className="background" style={backgroundStyle}/>
                    {isShowConnOn && conns}
                    {isShowRoadOn && roads}
                    {isShowCarOn && cars}
                    {isShowControlOn && controls}
                    {
                        !!roadStart && currMode === ADDROAD &&
                        <div className="start marker" style={startMarkerStyle}/>
                    }
                    {
                        !!roadEnd &&  currMode === ADDROAD &&
                        <div className="end marker" style={endMarkerStyle}/>
                    }
                </div>
                <Interface width={width} height={height}/>
            </div>
        );
    }
}

export default TrafficPage;