import React from "react";

import Hexagon from "../../Components/Hexagon";
import { flamingoColors, crowColors, chickenColors, parrotColors } from "../../Assets/Constants";
import Bird from "../../Components/Bird";

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
        const hexagon1ContainerStyle = {
            position: "absolute",
            left: 0,
            top: -hexagon1Dy,
            zIndex: zIndex,
            transition: ".5s",
        };
        const hexagon2ContainerStyle = {
            position: "relative",
            left: 1.5 * size,
            top: verticalRatio * 0.866 * size - hexagon2Dy,
            zIndex: zIndex + 1,
            transition: ".5s",
        };

        return (
            <div className="doubleHexagon" style={doubleHexagonStyle}>
                <div className="hexagon1Container" style={hexagon1ContainerStyle}>
                    <Hexagon size={0.95 * size} color={color1} verticalRatio={verticalRatio}/>
                </div>
                <div className="hexagon2Container" style={hexagon2ContainerStyle}>
                    <Hexagon size={0.95 * size} color={color2} verticalRatio={verticalRatio}/>
                </div>
            </div>
        );
    }
}

function randomColor() {
    const letters = '0123456789ABCDEF';
    let r = Math.random();
    let g = Math.random();
    let b = Math.random();
    let sum = r + g + b;
    r = Math.min(Math.floor(32 / sum * r), 15);
    g = Math.min(Math.floor(32 / sum * g), 15);
    b = Math.min(Math.floor(32 / sum * b), 15);
    return `#${letters[r]}${letters[g]}${letters[b]}`;
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
    width = (3 * this.n + 0.5) * this.size;
    height = this.verticalRatio * (1.732 * this.m + 0.866) * this.size;
    hoverDy = 40;
    birdSize = 70;

    element = document.getElementsByClassName("hexagonGridContainer")[0];

    state = {
        hexagonPositions: null,
        selectedX: null,
        selectedY: null,
        selectedZ: true,
        birdX: 1,
        birdY: 2,
        birdZ: true,
        isBirdRight: true,
    }

    onMouseMove = e => {
        if(!this.element) {
            this.element = document.getElementsByClassName("hexagonGridContainer")[0];
        }
        let { hexagonPositions } = this.state;
        if(!hexagonPositions) return;

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
            hexagonPositions: hexagonPositions,
            selectedX: selectedX,
            selectedY: selectedY,
            selectedZ: selectedZ,
        });
    }

    onClick = e => {
        const { selectedX, selectedY, selectedZ } = this.state;
        console.log(selectedX, selectedY, selectedZ);
    }

    onKeyDown = e => {
        const { birdX, birdY, birdZ } = this.state;
        if(e.code === "KeyW") {
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
        } else if(e.code === "KeyE") {
            if(birdY === 0) return;
            this.setState({
                ...this.state,
                birdY: birdY - 1,
            });
        } else if(e.code === "KeyD") {
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
        } else if(e.code === "KeyX") {
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
        } else if(e.code === "KeyZ") {
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
            console.log(birdX, birdY, birdZ);
        } else {
            console.log(e);
        }
    }

    componentDidMount() {
        let hexagonPositions = [];
        for(let i=0; i<this.n; i++) {
            let list = [];
            for(let j=0; j<this.m; j++) {
                list.push({
                    left: i * 3 * this.size,
                    top: j * this.verticalRatio * 1.732 * this.size,
                    color1: randomColor(),
                    color2: randomColor(),
                });
            }
            hexagonPositions.push(list);
        }
        this.setState({
            ...this.state,
            hexagonPositions: hexagonPositions,
        });
    }

    renderHexagons = function() {
        const { hexagonPositions, selectedX, selectedY, selectedZ } = this.state;
        if(!hexagonPositions) return null;

        let hexagons = [];
        for(let i=0; i<this.n; i++) {
            for(let j=0; j<this.m; j++) {
                const hexagonPosition = hexagonPositions[i][j];
                const doubleHexagonContainerStyle = {
                    position: "absolute",
                    left: hexagonPosition.left,
                    top: hexagonPosition.top,
                };
                let hexagon1Dy = 0;
                let hexagon2Dy = 0;
                if(i === selectedX && j === selectedY) {
                    if(selectedZ) {
                        hexagon1Dy = this.hoverDy;
                    }
                    else {
                        hexagon2Dy = this.hoverDy;
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
                            color1={hexagonPosition.color1}
                            color2={hexagonPosition.color2}
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
            hexagonPositions, 
            birdX, 
            birdY, 
            birdZ, 
            isBirdRight,
            selectedX, 
            selectedY, 
            selectedZ,
        } = this.state;
        if(!hexagonPositions) return null;

        const gridStyle = {
            position: "relative",
            width: this.width,
            height: this.height,
        }

        let birdDy = 0;
        if(birdX === selectedX && birdY === selectedY && birdZ === selectedZ) {
            birdDy = this.hoverDy;
        }
        const birdContainerStyle = {
            position: "absolute",
            left: hexagonPositions[birdX][birdY].left + (birdZ ? 0 : 1.5 * this.size) + (0.95 * this.size - this.birdSize / 2),
            top: hexagonPositions[birdX][birdY].top + (birdZ ? 0 : this.verticalRatio * 0.833 * this.size) - 10 - birdDy,
            zIndex: birdY + 2,
            transition: ".5s",
        }

        return (
            <div 
                className="grid" 
                style={gridStyle} 
                onMouseMove={this.onMouseMove}
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
        );
    }
}

export default HexagonGrid;