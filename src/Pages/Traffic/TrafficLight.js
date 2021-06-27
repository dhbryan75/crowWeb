import React from "react";

class TrafficLight extends React.Component {
    render() {
        const {
            trafficLightInfo,
        } = this.props;

        const trafficLightStyle = {
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