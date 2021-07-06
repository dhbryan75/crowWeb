import React from "react";

class Control extends React.Component {
    render() {
        const {
            controlInfo,
            isSelecting,
        } = this.props;

        let controlStyle = {
            position: "absolute",
            left: controlInfo.left,
            top: controlInfo.top,
            transform: `rotate(${controlInfo.angle}rad)`,
            zIndex: controlInfo.zIndex,
            width: controlInfo.width(),
            height: controlInfo.breadth,
            background: controlInfo.isOpened() ? "#0f0" : "#f00",
        }
        if(isSelecting) {
            controlStyle["opacity"] = controlInfo.isSelected() ? 1 : 0.5;
        }

        return (
            <div className="control" onClick={isSelecting ? controlInfo.onClick : undefined} style={controlStyle}>
            </div>
        )
    }
}

export default Control;