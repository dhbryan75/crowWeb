import React from "react";

import Lane from "./Lane";

class Road extends React.Component {
    render() {
        const {
            roadInfo,
        } = this.props;

        const roadStyle = {
            width: roadInfo.length,
            height: roadInfo.laneWidth * roadInfo.lane - roadInfo.laneBorderWidth,
            background: "#ff0",
            borderTop: `solid ${roadInfo.borderWidth}px #000`,
            borderBottom: `solid ${roadInfo.borderWidth}px #000`,
        };
        
        let lanes = roadInfo.laneInfos.map(laneInfo => {
            return (
                <Lane laneInfo={laneInfo}/>
            );
        });

        return (
            <div className="road" style={roadStyle}>
                {lanes}
            </div>
        );
    }
}

export default Road;