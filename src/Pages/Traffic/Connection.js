import React from "react";

import Car from "./Car";

class Connection extends React.Component {
    render() {
        const {
            connectionInfo,
        } = this.props;

        if(connectionInfo.length1 > 0) {
            var line1Style = {
                position: "absolute",
                left: connectionInfo.left1,
                top: connectionInfo.top1,
                transform: `rotate(${connectionInfo.angle1}rad)`,
                zIndex: connectionInfo.zIndex,
                width: connectionInfo.length1,
                height: connectionInfo.breadth,
                background: "#444",
            };
        }
        const line2Style = {
            position: "absolute",
            left: connectionInfo.left2,
            top: connectionInfo.top2,
            zIndex: connectionInfo.zIndex,
            width: (connectionInfo.radius - connectionInfo.breadth / 2) * 2,
            height: (connectionInfo.radius - connectionInfo.breadth / 2) * 2,
            borderRadius: "50%",
            border: `solid ${connectionInfo.breadth}px #444`,
        };
        if(connectionInfo.length3 > 0) {
            var line3Style = {
                position: "absolute",
                left: connectionInfo.left3,
                top: connectionInfo.top3,
                transform: `rotate(${connectionInfo.angle3}rad)`,
                zIndex: connectionInfo.zIndex,
                width: connectionInfo.length3,
                height: connectionInfo.breadth,
                background: "#444",
            };
        }
        
        let cars1 = [];
        let cars2 = [];
        let cars3 = [];
        connectionInfo.carInfos.forEach(carInfo => {
            cars1.push(<Car carInfo={carInfo}/>);
        });

        return (
            <>
                {
                    connectionInfo.length3 > 0 &&
                    <div className="line3" style={line3Style}>
                        {cars3}
                    </div>
                }
                <div className="line2" style={line2Style}>
                    {cars2}
                </div>
                {
                    connectionInfo.length1 > 0 &&
                    <div className="line1" style={line1Style}>
                        {cars1}
                    </div>
                }
            </>
        );
    }
}

export default Connection;