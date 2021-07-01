import React from "react";

import Lane from "./Lane";

class Road extends React.Component {
    render() {
        const {
            roadInfo,
        } = this.props;

        const roadStyle = {
            position: "absolute",
            left: roadInfo.left,
            top: roadInfo.top,
            transform: `rotate(${roadInfo.angle}rad)`,
            zIndex: roadInfo.zIndex,
            width: roadInfo.length,
            height: roadInfo.breadth,
            background: "#444",
            borderTop: `solid ${roadInfo.borderWidth}px #000`,
            borderBottom: `solid ${roadInfo.borderWidth}px #000`,
            opacity: roadInfo.isSelected ? 0.7 : 1,
            transition: ".5s",
        };
        
        let lanes = roadInfo.laneInfos.map(laneInfo => {
            return <Lane key={laneInfo.id} laneInfo={laneInfo}/>
        });

        return (
            <div className="road" style={roadStyle} onClick={roadInfo.toggleIsSelected}>
                {lanes}
            </div>
        );
    }
}

export default Road;