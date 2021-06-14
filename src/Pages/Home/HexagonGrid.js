import React from "react";

import Hexagon from "../../Components/Hexagon";

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
            transition: ".5s",
        };
        const hexagon2ContainerStyle = {
            position: "relative",
            left: 1.5 * size,
            top: verticalRatio * 0.866 * size - hexagon2Dy,
            transition: ".5s",
        };

        return (
            <div className="doubleHexagon" style={doubleHexagonStyle}>
                <div className="hexagon1Container" style={hexagon1ContainerStyle}>
                    <Hexagon size={0.95 * size} color={color1} verticalRatio={verticalRatio} zIndex={zIndex}/>
                </div>
                <div className="hexagon2Container" style={hexagon2ContainerStyle}>
                    <Hexagon size={0.95 * size} color={color2} verticalRatio={verticalRatio} zIndex={zIndex + 1}/>
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
    element = document.getElementsByClassName("hexagonGridContainer")[0];;

    state = {
        mouseX: 0,
        mouseY: 0,
        coords: [],
    }

    onMouseMove = e => {
        if(!this.element) {
            this.element = document.getElementsByClassName("hexagonGridContainer")[0];
            return
        }
        this.setState({
            ...this.state,
            mouseX: e.pageX - this.element.offsetLeft,
            mouseY: e.pageY - this.element.offsetTop,
        })
    }

    componentDidMount() {
        let coords = [];
        for(let i=0; i<this.n; i++) {
            for(let j=0; j<this.m; j++) {
                coords.push({
                    x: i,
                    y: j,
                    color1: randomColor(),
                    color2: randomColor(),
                })
            }
        }
        console.log(coords)
        this.setState({
            ...this.state,
            coords: coords,
        });
    }

    render() {
        const { mouseX, mouseY, coords } = this.state;

        const gridStyle = {
            position: "relative",
            width: this.width,
            height: this.height,
        }

        return (
            <div id="hexagonGrid" className="grid" style={gridStyle} onMouseMove={this.onMouseMove}>
            {
                coords.map(coord => {
                    const left = coord.x * 3 * this.size;
                    const top = coord.y * this.verticalRatio * 1.732 * this.size;
                    const x1 = left;
                    const y1 = top;
                    const x2 = left + 1.5 * this.size;
                    const y2 = top + this.verticalRatio * 0.866 * this.size;
                    const w = 2 * this.size;
                    const h = this.verticalRatio * 1.732 * this.size;
                    let hexagon1Dy = 0;
                    let hexagon2Dy = 0;

                    if(!!mouseX && isInHexagon(mouseX - x1, mouseY - y1, w, h)) {
                        hexagon1Dy = this.hoverDy;
                    }
                    if(!!mouseX && isInHexagon(mouseX - x2, mouseY - y2, w, h)) {
                        hexagon2Dy = this.hoverDy;
                    }

                    const doubleHexagonContainerStyle = {
                        position: "absolute",
                        left: left,
                        top: top,
                    }

                    return (
                        <div 
                            className="doubleHexagonContainer" 
                            style={doubleHexagonContainerStyle}
                            key={`(${coord.x}, ${coord.y})`}
                        >
                            <DoubleHexagon 
                                size={this.size} 
                                color1={coord.color1}
                                color2={coord.color2}
                                verticalRatio={this.verticalRatio}
                                zIndex={coord.y}
                                hexagon1Dy={hexagon1Dy}
                                hexagon2Dy={hexagon2Dy}
                            />
                        </div>
                    )
                })
            }
            </div>
        );
    }
}

export default HexagonGrid;