import React from "react";

class TrafficLight extends React.Component {
    render() {
        const {
            trafficLightInfo,
        } = this.props;

        const trafficLightStyle = {
            position: "absolute",
            left: trafficLightInfo.x,
            top: 0,
            zIndex: trafficLightInfo.roadInfo.zIndex + 2,
            width: trafficLightInfo.isOpened() ? 0 : trafficLightInfo.remainTime() * 0.08,
            height: trafficLightInfo.roadInfo.laneWidth,
            background: "#f00",
        }

        return (
            <div className="trafficLight" style={trafficLightStyle}>
            </div>
        )
    }
}

export default TrafficLight;