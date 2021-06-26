import React from "react";

class TrafficLight extends React.Component {
    render() {
        const {
            width,
            height,
            isOpened,
        } = this.props;

        const trafficLightStyle = {
            width: isOpened ? 0 : width,
            height: height,
            background: "#f00",
        }

        return (
            <div className="trafficLight" style={trafficLightStyle}>
            </div>
        )
    }
}

export default TrafficLight;