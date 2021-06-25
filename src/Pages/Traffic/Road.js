import React from "react";

import Car from "./Car";

class Lane extends React.Component {
    render() {
        const {
            width,
            height,
            laneBorderWidth,
            carProps,
        } = this.props;

        const laneStyle = {
            position: "relative",
            width: width,
            height: height,
            background: "#444",
            borderBottom: `dotted ${laneBorderWidth}px #fff`,
        }

        const arrowStyle = {
            position: "absolute",
            left: width / 2 - 5,
            top: height / 2 - 5,
            borderLeft: "solid 10px #fff",
            borderTop: "solid 5px transparent",
            borderBottom: "solid 5px transparent",
        }

        let cars = carProps.map(carProp => {
            const carContainerStyle = {
                position: "absolute",
                left: carProp.x,
                top: carProp.y + (height - carProp.height) / 2,
                zIndex: carProp.zIndex,
            }

            return (
                <div className="carContainer" style={carContainerStyle}>
                    <Car 
                        width={carProp.width}
                        height={carProp.height}
                        colors={carProp.colors}
                    />
                </div>
            );
        });

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
            centerLineWidth,
            roadBorderWidth,
            laneWidth,
            laneBorderWidth,
            carProps,
        } = this.props;

        let isOneWay = lane12 == 0 || lane21 == 0;
        let lane = lane12 + lane21;
        let center = line.center();
        let width = line.length();
        let height = (isOneWay ? -laneBorderWidth : centerLineWidth -laneBorderWidth * 2) + laneWidth * lane;
        let angle = line.angle();

        const roadStyle = {
            position: "absolute",
            left: center.x - width / 2,
            top: center.y - height / 2,
            zIndex: zIndex,
            width: width,
            height: height,
            background: "#ff0",
            borderTop: `solid ${roadBorderWidth}px #000`,
            borderBottom: `solid ${roadBorderWidth}px #000`,
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
            top: (isOneWay ? 0 : centerLineWidth - laneBorderWidth) + laneWidth * lane21,
            height: laneWidth * lane12,
        };

        const lanes21Style = {
            ...lanesStyle,
            top: -laneBorderWidth,
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
        carProps.forEach(carProp => {
            let laneCarProp = carProp.isForward ? lanes12CarProps[carProp.lane] : lanes21CarProps[carProp.lane];
            
            let y = laneWidth * carProp.laneChangeRate * (carProp.nextLane - carProp.lane);
            laneCarProp.push({
                width: carProp.width,
                height: carProp.height,
                colors: carProp.colors,
                x: carProp.x,
                y: y,
                zIndex: zIndex + 1,
            });
        });
        
        let lanes12 = [];
        for(let i=0; i < lane12; i++) {
            let isLastLane = i == (lane12 - 1);
            lanes12.push(
                <Lane 
                    width={width} 
                    height={laneWidth - laneBorderWidth}
                    laneBorderWidth={isLastLane ? 0 : laneBorderWidth}
                    carProps={lanes12CarProps[i]}
                />
            );
        }
        let lanes21 = [];
        for(let i=0; i < lane21; i++) {
            let isLastLane = i == (lane21 - 1);
            lanes21.push(
                <Lane 
                    width={width} 
                    height={laneWidth - laneBorderWidth}
                    laneBorderWidth={isLastLane ? 0: laneBorderWidth}
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