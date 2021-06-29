import React from "react";

class Lane extends React.Component {
    render() {
        const {
            laneInfo,
        } = this.props;

        const laneStyle = {
            position: "absolute",
            left: laneInfo.left,
            top: laneInfo.top,
            zIndex: laneInfo.zIndex,
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


        return (
            <div className="lane" style={laneStyle}>
                <div className="arrow" style={arrowStyle}/>
            </div>
        );
    }
}

export default Lane;