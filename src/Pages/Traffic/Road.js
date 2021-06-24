import React from "react";

import Car from "./Car";

const centerLineWidth = 4;
const roadBorder = 4;
const laneWidth = 60;
const laneBorder = 2;

class Lane extends React.Component {
    render() {
        const {
            width,
            height,
            carProps,
        } = this.props;

        const laneStyle = {
            position: "relative",
            width: width,
            height: height,
            background: "#444",
            borderBottom: `dotted ${laneBorder}px #fff`,
        }

        const arrowStyle = {
            position: "absolute",
            left: width / 2 - 5,
            top: height / 2 - 5,
            borderLeft: "solid 10px #fff",
            borderTop: "solid 5px transparent",
            borderBottom: "solid 5px transparent",
        }

        let cars = [];
        for(let i in carProps) {
            let carProp = carProps[i];

            const carContainerStyle = {
                position: "absolute",
                left: carProp.x,
                top: (height - carProp.height) / 2,
            }

            cars.push(
                <div className="carContainer" style={carContainerStyle}>
                    <Car 
                        width={carProp.width}
                        height={carProp.height}
                        colors={carProp.colors}
                    />
                </div>
            )
        }

        return (
            <div className="lane" style={laneStyle}>
                <div className="arrow" style={arrowStyle}/>
                {cars}
            </div>
        );
    }
}

class Road extends React.Component {
    render() {
        const {
            line,
            lane12,
            lane21,
            zIndex,
            carProps,
        } = this.props;

        let lane = lane12 + lane21;
        let center = line.center();
        let width = line.length();
        let height = centerLineWidth + laneWidth * lane;
        let angle = line.angle();

        const roadStyle = {
            position: "absolute",
            left: center.x - width / 2,
            top: center.y - height / 2,
            zIndex: zIndex,
            width: width,
            height: height,
            background: "#ff0",
            borderTop: `solid ${roadBorder}px #000`,
            borderBottom: `solid ${roadBorder}px #000`,
            transform: `rotate(${angle}rad)`,
        };

        const lanesStyle = {
            position: "absolute",
            left: 0,
            zIndex: zIndex,
            width: width,
        }

        const lanes12Style = {
            ...lanesStyle,
            top: roadBorder + laneWidth * lane21,
            height: laneWidth * lane12,
        };

        const lanes21Style = {
            ...lanesStyle,
            top: 0,
            height: laneWidth * lane21,
            transform: `rotate(${Math.PI}rad)`,
        };

        let lanes12CarProps = [];
        for(let i=0; i<lane12; i++) {
            lanes12CarProps.push([]);
        }
        let lanes21CarProps = [];
        for(let i=0; i<lane21; i++) {
            lanes21CarProps.push([]);
        }
        for(let i in carProps) {
            let carProp = carProps[i];
            let laneCarProp = carProp.isForward ? lanes12CarProps[carProp.lane] : lanes21CarProps[carProp.lane];
            laneCarProp.push({
                width: carProp.width,
                height: carProp.height,
                colors: carProp.colors,
                x: carProp.x,
            })
        }
        
        let lanes12 = [];
        for(let i=0; i < lane12; i++) {
            lanes12.push(
                <Lane 
                    width={width} 
                    height={laneWidth - laneBorder}
                    carProps={lanes12CarProps[i]}
                />
            );
        }
        let lanes21 = [];
        for(let i=0; i < lane21; i++) {
            lanes21.push(
                <Lane 
                    width={width} 
                    height={laneWidth - laneBorder}
                    carProps={lanes21CarProps[i]}
                />
            );
        }

        return (
            <div className="road" style={roadStyle}>
                <div className="lanes12" style={lanes12Style}>
                    {lanes12}
                </div>
                <div className="lanes21" style={lanes21Style}>
                    {lanes21}
                </div>
            </div>
        );
    }
}

export default Road;