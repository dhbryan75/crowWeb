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
            zIndex: controlInfo.zIndex,
            width: controlInfo.width(),
            height: controlInfo.width(),
            borderRadius: "50%",
            background: controlInfo.isOpened() ? "#0f0" : "#f00",
        }

        return (
            <div className="control" style={controlStyle}>
            </div>
        )
    }
}

export default Control;