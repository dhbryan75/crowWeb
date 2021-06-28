import React from "react";

import Car from "./Car";
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
            zIndex: laneInfo.roadInfo.zIndex + 2,
            borderLeft: "solid 10px #fff",
            borderTop: "solid 5px transparent",
            borderBottom: "solid 5px transparent",
        }

        let cars = laneInfo.carInfos.filter(carInfo => {
            return !carInfo.isQueued();
        }).map(carInfo => {
            return <Car carInfo={carInfo}/>
        });

        let trafficLights = laneInfo.trafficLightInfos.map(trafficLightInfo => {
            return <TrafficLight trafficLightInfo={trafficLightInfo}/>
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