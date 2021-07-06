import React from "react";

import Lane from "./Lane";

class Road extends React.Component {
    render() {
        const {
            roadInfo,
            isSelecting,
            isSelectingLane,
        } = this.props;

        let roadStyle = {
            position: "absolute",
            left: roadInfo.left,
            top: roadInfo.top,
            transform: `rotate(${roadInfo.angle}rad)`,
            zIndex: roadInfo.zIndex,
            width: roadInfo.length,
            height: roadInfo.breadth,
            borderTop: `solid ${roadInfo.borderWidth}px #000`,
            borderBottom: `solid ${roadInfo.borderWidth}px #000`,
        };
        if(isSelecting) {
            roadStyle["opacity"] = roadInfo.isSelected() ? 1 : 0.5;
        }
        
        let lanes = roadInfo.laneInfos.map(laneInfo => {
            return <Lane 
                key={laneInfo.id} 
                laneInfo={laneInfo}
                isSelecting={isSelectingLane}
            />
        });

        return (
            <div className="road" onClick={isSelecting ? roadInfo.onClick : undefined} style={roadStyle}>
                {lanes}
            </div>
        );
    }
}

export default Road;