import React from "react";

import Car from "./Car";

class Conn extends React.Component {
    render() {
        const {
            connInfo,
        } = this.props;

        if(connInfo.length1 > 0) {
            var line1Style = {
                position: "absolute",
                left: connInfo.left1,
                top: connInfo.top1,
                transform: `rotate(${connInfo.angle1}rad)`,
                zIndex: connInfo.zIndex,
                width: connInfo.length1,
                height: connInfo.breadth,
                background: "#444",
            };
        }
        const line2Style = {
            position: "absolute",
            left: connInfo.left2,
            top: connInfo.top2,
            zIndex: connInfo.zIndex,
            width: (connInfo.radius - connInfo.breadth / 2) * 2,
            height: (connInfo.radius - connInfo.breadth / 2) * 2,
            borderRadius: "50%",
            border: `solid ${connInfo.breadth}px #444`,
        };
        if(connInfo.length3 > 0) {
            var line3Style = {
                position: "absolute",
                left: connInfo.left3,
                top: connInfo.top3,
                transform: `rotate(${connInfo.angle3}rad)`,
                zIndex: connInfo.zIndex,
                width: connInfo.length3,
                height: connInfo.breadth,
                background: "#444",
            };
        }
        
        let cars1 = [];
        let cars2 = [];
        let cars3 = [];
        connInfo.carInfos.forEach(carInfo => {
            cars1.push(<Car carInfo={carInfo}/>);
        });

        return (
            <>
                {
                    connInfo.length3 > 0 &&
                    <div className="line3" style={line3Style}>
                        {cars3}
                    </div>
                }
                <div className="line2" style={line2Style}>
                    {cars2}
                </div>
                {
                    connInfo.length1 > 0 &&
                    <div className="line1" style={line1Style}>
                        {cars1}
                    </div>
                }
            </>
        );
    }
}

export default Conn;