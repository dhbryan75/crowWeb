import React from "react";

import Hexagon from "../../Components/Hexagon";
import { flamingoColors, crowColors, chickenColors, parrotColors } from "../../Assets/Constants";
import Bird from "../../Components/Bird";

import "./style.css";

class BorderHexagon extends React.Component {
    render() {
        const {
            size,
            color,
            verticalRatio,
            borderWidth,
        } = this.props;

        const innerHexagonContainerStyle = {
            position: "absolute",
            left: 2 * borderWidth,
            top: verticalRatio * 1.732 * borderWidth,
        }

        return (
            <>
                <Hexagon size={size} color="#000" verticalRatio={verticalRatio}/>
                <div className="innerHexagonContainer" style={innerHexagonContainerStyle}>
                    <Hexagon size={size - 2 * borderWidth} color={color} verticalRatio={verticalRatio}/>
                </div>
            </>
        )
    }
}



class DoubleHexagon extends React.Component {
    render() {
        const {
            size,
            color1,
            color2,
            verticalRatio,
            zIndex,
            hexagon1Dy,
            hexagon2Dy,
        } = this.props;

        const doubleHexagonStyle = {
            position: "relative",
            width: 3.5 * size,
            height: verticalRatio * 2.598 * size,
        };
        const hexagonContainerStyle = {
            position: "absolute",
            transition: ".5s",
        }
        const hexagon1ContainerStyle = {
            ...hexagonContainerStyle,
            left: 0,
            top: -hexagon1Dy,
            zIndex: zIndex,
        };
        const hexagon2ContainerStyle = {
            ...hexagonContainerStyle,
            left: 1.5 * size,
            top: verticalRatio * 0.866 * size - hexagon2Dy,
            zIndex: zIndex + 1,
        };

        return (
            <div className="doubleHexagon" style={doubleHexagonStyle}>
                <div className="hexagon1Container" style={hexagon1ContainerStyle}>
                    {
                        !!color1 ? 
                        <BorderHexagon size={0.95 * size} color={color1} verticalRatio={verticalRatio} borderWidth={2}/> : 
                        <BorderHexagon size={0.95 * size} color="#fff" verticalRatio={verticalRatio} borderWidth={2}/>
                    }
                </div>
                <div className="hexagon2Container" style={hexagon2ContainerStyle}>
                    {
                        !!color2 ? 
                        <BorderHexagon size={0.95 * size} color={color2} verticalRatio={verticalRatio} borderWidth={2}/> : 
                        <BorderHexagon size={0.95 * size} color="#fff" verticalRatio={verticalRatio} borderWidth={2}/>
                    }
                </div>
            </div>
        );
    }
}

function isInHexagon(x, y, w, h) {
    if(x < 0 || w < x || y < 0 || h < y)
        return false;
    if(y < -(0.866 / 0.5) * x + 0.5 * h)
        return false;
    if(y < (0.866 / 0.5) * (x - w) + 0.5 * h)
        return false;
    if(y > -(0.866 / 0.5) * (x - w) + 0.5 * h)
        return false;
    if(y > (0.866 / 0.5) * x + 0.5 * h)
        return false;
    return true;

}

class HexagonGrid extends React.Component {
    size = 80;
    verticalRatio = 0.8;
    n = 10;
    m = 14;
    birdDy = -5;
    birdSize = 70;

    hexagonInfos = [
        {
            x: 1,
            y: 2,
            z: true,
            color: "#ff0",
            link: "/traffic",
            title: "Traffic",
            desc: "Traffic simulation for rehabilitation therapy. ▪▪▪▫▫ ",
        },
        {
            x: 1,
            y: 2,
            z: false,
            color: "#0ff",
            link: "/u1",
            title: "Untitled1",
            desc: "untitled1. ▪▪▪▫▫ ",
        },
        {
            x: 1,
            y: 3,
            z: true,
            color: "#f0f",
            link: "/u2",
            title: "Untitled2",
            desc: "untitled2. ▪▪▪▫▫ ",
        },
    ];

    element = document.getElementsByClassName("hexagonGridContainer")[0];

    state = {
        hexagonProps: null,
        selectedX: null,
        selectedY: null,
        selectedZ: true,
        birdX: 1,
        birdY: 2,
        birdZ: true,
        isBirdRight: true,
    }



    onClick = e => {
        if(!this.element) {
            this.element = document.getElementsByClassName("hexagonGridContainer")[0];
        }
        let { hexagonProps } = this.state;
        if(!hexagonProps) return;

        const w = 2 * this.size;
        const h = this.verticalRatio * 1.732 * this.size;
        let mouseX = e.pageX - this.element.offsetLeft;
        let mouseY = e.pageY - this.element.offsetTop;
        let xIdx1 = Math.floor(mouseX / (1.5 * w));
        let yIdx1 = Math.floor(mouseY / h);
        let x1 = mouseX % (1.5 * w);
        let y1 = mouseY % h;
        let xIdx2 = Math.floor((mouseX - 0.75 * w) / (1.5 * w));
        let yIdx2 = Math.floor((mouseY - 0.5 * h) / h);
        let x2 = (mouseX - 0.75 * w) % (1.5 * w);
        let y2 = (mouseY - 0.5 * h) % h;
        let selectedX = null;
        let selectedY = null;
        let selectedZ = null;
        
        if(isInHexagon(x1, y1, w, h)) {
            selectedX = xIdx1;
            selectedY = yIdx1;
            selectedZ = true;
        }
        else if(isInHexagon(x2, y2, w, h)) {
            selectedX = xIdx2;
            selectedY = yIdx2;
            selectedZ = false;
        }

        this.setState({
            ...this.state,
            hexagonProps: hexagonProps,
            selectedX: selectedX,
            selectedY: selectedY,
            selectedZ: selectedZ,
        });
        console.log(selectedX, selectedY, selectedZ);
    }



    onKeyDown = e => {
        const { birdX, birdY, birdZ, hexagonProps } = this.state;
        if(e.code === "KeyQ") {
            if(birdZ) {
                if(birdX === 0 || birdY === 0) return;
                this.setState({
                    ...this.state,
                    birdX: birdX - 1,
                    birdY: birdY - 1,
                    birdZ: false,
                    isBirdRight: false,
                });
            } else {
                this.setState({
                    ...this.state,
                    birdZ: true,
                    isBirdRight: false,
                });
            }
        } else if(e.code === "KeyW") {
            if(birdY === 0) return;
            this.setState({
                ...this.state,
                birdY: birdY - 1,
            });
        } else if(e.code === "KeyE") {
            if(birdZ) {
                if(birdY === 0) return;
                this.setState({
                    ...this.state,
                    birdY: birdY - 1,
                    birdZ: false,
                    isBirdRight: true,
                });
            } else {
                if(birdX === this.n - 1) return;
                this.setState({
                    ...this.state,
                    birdX: birdX + 1,
                    birdZ: true,
                    isBirdRight: true,
                });
            }
        } else if(e.code === "KeyD") {
            if(birdZ) {
                this.setState({
                    ...this.state,
                    birdZ: false,
                    isBirdRight: true,
                });
            } else {
                if(birdX === this.n - 1 || birdY === this.m - 1) return;
                this.setState({
                    ...this.state,
                    birdX: birdX + 1,
                    birdY: birdY + 1,
                    birdZ: true,
                    isBirdRight: true,
                });
            }
        } else if(e.code === "KeyS") {
            if(birdY === this.m - 1) return;
            this.setState({
                ...this.state,
                birdY: birdY + 1,
            });
        } else if(e.code === "KeyA") {
            if(birdZ) {
                if(birdX === 0) return;
                this.setState({
                    ...this.state,
                    birdX: birdX - 1,
                    birdZ: false,
                    isBirdRight: false,
                });
            } else {
                if(birdY === this.m - 1) return;
                this.setState({
                    ...this.state,
                    birdY: birdY + 1,
                    birdZ: true,
                    isBirdRight: false,
                });
            }
        } else if(e.code === "Space") {
            e.preventDefault(); 
            let path = hexagonProps[birdX][birdY][birdZ ? "link1" : "link2"];
            if(!path) return;
            document.location.href = path;
        } else {
            console.log(e);
        }
    }



    componentDidMount() {
        let hexagonProps = [];
        for(let i=0; i<this.n; i++) {
            let list = [];
            for(let j=0; j<this.m; j++) {
                let left = i * 3 * this.size;
                let top = j * this.verticalRatio * 1.732 * this.size;
                list.push({
                    left1: left,
                    top1: top,
                    left2: left + 1.5 * this.size,
                    top2: top + this.verticalRatio * 0.833 * this.size,
                });
            }
            hexagonProps.push(list);
        }

        for(let i in this.hexagonInfos) {
            let hexagonInfo = this.hexagonInfos[i];
            hexagonProps[hexagonInfo.x][hexagonInfo.y] = hexagonInfo.z ? {
                ...hexagonProps[hexagonInfo.x][hexagonInfo.y],
                color1: hexagonInfo.color,
                link1: hexagonInfo.link,
                title1: hexagonInfo.title,
                desc1: hexagonInfo.desc,
            } : {
                ...hexagonProps[hexagonInfo.x][hexagonInfo.y],
                color2: hexagonInfo.color,
                link2: hexagonInfo.link,
                title2: hexagonInfo.title,
                desc2: hexagonInfo.desc,
            }
        }

        this.setState({
            ...this.state,
            hexagonProps: hexagonProps,
        });
    }



    renderHexagons = function() {
        const { hexagonProps, birdX, birdY, birdZ } = this.state;
        if(!hexagonProps) return null;

        let hexagons = [];
        for(let i=0; i<this.n; i++) {
            for(let j=0; j<this.m; j++) {
                const hexagonProp = hexagonProps[i][j];
                const doubleHexagonContainerStyle = {
                    position: "absolute",
                    left: hexagonProp.left1,
                    top: hexagonProp.top1,
                };
                let hexagon1Dy = 0;
                let hexagon2Dy = 0;
                if(i === birdX && j === birdY) {
                    if(birdZ) {
                        hexagon1Dy = this.birdDy;
                    }
                    else {
                        hexagon2Dy = this.birdDy;
                    }
                }
    
                hexagons.push(
                    <div 
                        className="doubleHexagonContainer" 
                        style={doubleHexagonContainerStyle}
                        key={`(${i}, ${j})`}
                    >
                        <DoubleHexagon 
                            size={this.size} 
                            color1={hexagonProp.color1}
                            color2={hexagonProp.color2}
                            verticalRatio={this.verticalRatio}
                            zIndex={j}
                            hexagon1Dy={hexagon1Dy}
                            hexagon2Dy={hexagon2Dy}
                        />
                    </div>
                );
            }
        }

        return hexagons;
    }



    render() {
        const { 
            hexagonProps, 
            birdX, 
            birdY, 
            birdZ, 
            isBirdRight,
        } = this.state;
        if(!hexagonProps) return null;

        const hexagonProp = hexagonProps[birdX][birdY];
        
        const birdContainerStyle = {
            position: "absolute",
            left: hexagonProp[birdZ ? "left1" : "left2"] + (0.95 * this.size - this.birdSize / 2),
            top: hexagonProp[birdZ ? "top1" : "top2"] + 3,
            zIndex: birdY + 2,
        }

        const informationStyle = {
            display: hexagonProp[birdZ ? "color1" : "color2"] ? "flex" : "none",
            background: hexagonProp[birdZ ? "color1" : "color2"] + "b",
        }

        return (
            <>
                <div 
                    className="grid"
                    onClick={this.onClick}
                    onKeyDown={this.onKeyDown}
                    tabIndex="0"
                >
                    {
                        this.renderHexagons()
                    }
                    <div className="birdContainer" style={birdContainerStyle}>
                        <Bird
                            isRight={isBirdRight}
                            size={this.birdSize}
                            colors={crowColors}
                        />
                    </div>
                </div>
                <div className="information" style={informationStyle}>
                    <div className="title">
                        {hexagonProps[birdX][birdY][birdZ ? "title1" : "title2"]}
                    </div>
                    <div className="desc">
                        {hexagonProps[birdX][birdY][birdZ ? "desc1" : "desc2"]}
                    </div>
                </div>
            </>
        );
    }
}

export default HexagonGrid;