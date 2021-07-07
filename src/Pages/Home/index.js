import React from "react";

import { Object, FixedSpring, Vector } from "../../Assets/Physic2D";
import { delay } from "../../Assets/Functions";

import Hexagon from "../../Components/Hexagon";
import { isCompositeComponent } from "react-dom/test-utils";
import zIndex from "@material-ui/core/styles/zIndex";




const dt = 0.1;
const interval = 5;
const refreshPeriod = 60 * 60 * 1000;


const hexagonSize = 70;
const hexagonGap = 80;
const verticalRatio = 0.8;
const gridN = 15;
const gridM = 30;

const hexagonMass = 1;
const K = 40;
const B = 5;



const mouseOverVy = -80;
const stopMinY = 1;
const stopMinVy = 1;

const hexagonInfos = [
    {
        x: 7,
        y: 13,
        index: "01",
        color: "#8f8",
        link: "/traffic",
        title: "Traffic",
        desc: "User interactive traffic simulation.",
    },
    {
        x: 7,
        y: 14,
        index: "02",
        color: "#0ff",
        link: "/u1",
        title: "Untitled1",
        desc: "untitled1.",
    },
    {
        x: 7,
        y: 16,
        index: "03",
        color: "#f0f",
        link: "/u2",
        title: "Untitled2",
        desc: "untitled2.",
    },
];


var hexagonGrid = [];
for(let i=0; i<gridN; i++) {
    hexagonGrid.push([]);
    for(let j=0; j<gridM; j++) {
        let x = 3 * hexagonGap * i + (j % 2 == 0 ? hexagonGap * 1.5 : 0);
        let y = verticalRatio * 0.866 * hexagonGap * j;
        let center = new Vector(x, y);
        let left = x - hexagonSize;
        let top = y - verticalRatio * 0.866 * hexagonSize;
        let object = new Object(0, 0, 0, 0, hexagonMass);
        let fixedSpring = new FixedSpring(new Vector(0, 0), object, K, B);

        hexagonGrid[i].push({
            x: i,
            y: j,
            key: `${i},${j}`,
            center: center,
            left: left,
            top: top,
            zIndex: j,
            isMouseOver: false,
            isSelected: false,
            object: object,
            fixedSpring: fixedSpring,
            isMoving: false,
        });
    }
}

hexagonInfos.forEach(hexagonInfo => {
    hexagonGrid[hexagonInfo.x][hexagonInfo.y] = {
        ...hexagonGrid[hexagonInfo.x][hexagonInfo.y],
        index: hexagonInfo.index,
        color: hexagonInfo.color,
        link: hexagonInfo.link,
        title: hexagonInfo.title,
        desc: hexagonInfo.desc,
    };
});


var selectedX;
var selectedY;
var screenCenter = hexagonGrid[7][15].center.copy();


var isExpanding = false;
var expandSize = hexagonSize;
const expandSpeed = 70;
const expandEndSize = 1500;


const isStop = object => {
    return -stopMinY < object.p.y && object.p.y < stopMinY && -stopMinVy < object.v.y && object.v.y < stopMinVy;
}



const update = () => {
    hexagonGrid.forEach(hexagonList => {
        hexagonList.forEach(hexagon => {
            if(!hexagon.isMoving) {
                return;
            }
            hexagon.fixedSpring.force();
            hexagon.object.move(dt);
            if(isStop(hexagon.object)) {
                hexagon.object.p.x = 0;
                hexagon.object.p.y = 0;
                hexagon.object.v.x = 0;
                hexagon.object.v.y = 0;
                hexagon.isMoving = false;
            }
        });
    });
    if(isExpanding) {
        expandSize += expandSpeed;
        if(expandSize > expandEndSize) {
            document.location.href = hexagonGrid[selectedX][selectedY].link;
        }
    }
}



class HomePage extends React.Component {
    state = {
        hexagonGrid,
    }

    init = () => {}

    animate = async() => {
        for(let iteration = 0; iteration < (refreshPeriod / interval); iteration++) {
            update();
            this.setState({
                ...this.state,
                hexagonGrid,
            })
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
        const { 
            hexagonGrid,
        } = this.state;
        
        const screenStyle = {
            position: "absolute",
            left: width / 2 - screenCenter.x,
            top: height / 2 - screenCenter.y,
        }

        let hexagons = [];
        hexagonGrid.forEach(hexagonList => {
            hexagonList.forEach(hexagon => {
                let left, top, zIndex, size;
                let isExpandingHexagon = isExpanding && hexagon.x === selectedX && hexagon.y === selectedY;
                if(isExpandingHexagon) {
                    left = hexagon.center.x - expandSize;
                    top = hexagon.center.y - verticalRatio * 0.866 * expandSize;
                    zIndex = 999;
                    size = expandSize;
                }
                else {
                    left =  hexagon.left + hexagon.object.p.x;
                    top =  hexagon.top - hexagon.object.p.y;
                    zIndex = hexagon.zIndex;
                    size = hexagonSize;
                }

                const hexagonContainerStyle = {
                    position: "absolute",
                    left: left,
                    top: top,
                    zIndex: zIndex,
                }

                const onMouseOver = e => {
                    hexagon.isMouseOver = true;
                    if(!hexagon.isMoving) {
                        hexagon.object.v.y += mouseOverVy;
                        hexagon.isMoving = true;
                    }
                }

                const onMouseOut = e => {
                    hexagon.isMouseOver = false;
                }

                const onClick = e => {
                    if(hexagon.x === selectedX && hexagon.y === selectedY) {
                        if(!!hexagon.index) {
                            isExpanding = true;
                        }
                    }
                    else {
                        selectedX = hexagon.x;
                        selectedY = hexagon.y;
                    }
                }

                const indexStyle = {
                    position: "absolute", 
                    right: hexagonSize * 0.5, 
                    top: 0,
                    color: "#222",
                    fontSize: 25,
                    fontWeight: "bold",
                };

                hexagons.push(
                    <div 
                        className="hexagonContainer" 
                        key={hexagon.key}
                        onMouseOver={onMouseOver}
                        onMouseOut={onMouseOut}
                        onClick={onClick}
                        style={hexagonContainerStyle}
                    >
                        <Hexagon
                            size={size}
                            color={hexagon.color || "#bbb"}
                            verticalRatio={verticalRatio}
                        />
                        {
                            !!hexagon.index && !isExpandingHexagon &&
                            <div className="index" style={indexStyle}>
                                {hexagon.index}
                            </div>
                        }
                    </div>
                )
            })
        });

        
        let isInterfaceOn = !!selectedX && !!selectedY && !!hexagonGrid[selectedX][selectedY].index;
        if(isInterfaceOn) {
            var interfaceStyle = {
                position: "fixed",
                left: 0,
                bottom: 0,
                zIndex: 99,
                width: width,
                height: 200,
                background: hexagonGrid[selectedX][selectedY].color,
                display: "flex",
                flexDirection: "column",
                alignItem: "center",
                justifyContent: "flex-start",
            };

            var indexStyle = {
                position: "absolute",
                left: 30,
                top: 10,
                color: "#111",
                fontSize: 50,
                fontWeight: "bold",
            }
            var titleStyle = {
                marginTop: 20,
                color: "#111",
                fontSize: 40,
                fontWeight: "bold",
                display: "flex",
                alignItem: "center",
                justifyContent: "center",
            }
            var descStyle = {
                marginTop: 20,
                color: "#111",
                fontSize: 25,
                fontWeight: "normal",
                display: "flex",
                alignItem: "center",
                justifyContent: "center",
            }

            var onClickInterface = e => {
                isExpanding = true;
            }
        }

        return (
            <div className="home">
                <div 
                    className="screen" 
                    style={screenStyle}
                >
                    {hexagons}
                </div>
                {
                    isInterfaceOn &&
                    <div 
                        className="interface" 
                        onClick={onClickInterface}
                        style={interfaceStyle}
                    >
                        <div className="index" style={indexStyle}>
                            {hexagonGrid[selectedX][selectedY].index}
                        </div>
                        <div className="title" style={titleStyle}>
                            {hexagonGrid[selectedX][selectedY].title}
                        </div>
                        <div className="desc" style={descStyle}>
                            {hexagonGrid[selectedX][selectedY].desc}
                        </div>
                    </div>
                }
            </div>
        );
    }
}

export default HomePage;