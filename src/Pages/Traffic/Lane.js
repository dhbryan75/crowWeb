import React from "react";

import Car from "./Car";
import { LaneInfo } from "./TrafficInfo";
import TrafficLight from "./TrafficLight";

class Lane extends React.Component {
    render() {
        const {
            laneInfo,
        } = this.props;

        const laneStyle = {
            position: "relative",
            width: laneInfo.length,
            height: laneInfo.breadth,
            background: "#444",
            borderBottom: !laneInfo.rightLaneInfo() ? "unset" : `dotted ${laneInfo.borderWidth}px #fff`,
        }

        const arrowStyle = {
            position: "absolute",
            left: laneInfo.length / 2 - 5,
            top: laneInfo.breadth / 2 - 5,
            borderLeft: "solid 10px #fff",
            borderTop: "solid 5px transparent",
            borderBottom: "solid 5px transparent",
        }

        let cars = laneInfo.carInfos.map(carInfo => {
            const carContainerStyle = {
                position: "absolute",
                left: carInfo.x,
                top: carInfo.y + (laneInfo.breadth - carInfo.breadth) / 2,
                zIndex: carInfo.roadInfo.zIndex + 2,
            }

            return (
                <div className="carContainer" style={carContainerStyle}>
                    <Car carInfo={carInfo}/>
                </div>
            );
        });

        let trafficLights = laneInfo.trafficLightInfos.map(trafficLightInfo => {
            const trafficLightContainerStyle = {
                position: "absolute",
                left: trafficLightInfo.x,
                top: 0,
                zIndex: trafficLightInfo.roadInfo.zIndex + 1,
            }

            return (
                <div className="trafficLightContainer" style={trafficLightContainerStyle}>
                    <TrafficLight trafficLightInfo={trafficLightInfo}/>
                </div>
            );
        });

        return (
            <div className="lane" style={laneStyle}>
                <div className="arrow" style={arrowStyle}/>
                {cars}
                {trafficLights}
            </div>
        );
    }
}

export default Lane;