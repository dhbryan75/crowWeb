import React from "react";

class Control extends React.Component {
    render() {
        const {
            controlInfo,
        } = this.props;

        const controlStyle = {
            position: "absolute",
            left: controlInfo.left,
            top: controlInfo.top,
            transform: `rotate(${controlInfo.angle}rad)`,
            zIndex: controlInfo.roadInfo.zIndex + 2,
            width: controlInfo.isOpened() ? 0 : controlInfo.remainTime() * 0.08,
            height: controlInfo.laneInfo.breadth,
            borderRadius: 3,
            background: "#f00",
        }

        return (
            <div className="control" style={controlStyle}>
            </div>
        )
    }
}

export default Control;