import React from "react";

class Conn extends React.Component {
    render() {
        const {
            connInfo,
        } = this.props;

        if(connInfo.isStraight) {
            const lineStyle = {
                position: "absolute",
                left: connInfo.left,
                top: connInfo.top,
                transform: `rotate(${connInfo.angle}rad)`,
                zIndex: connInfo.zIndex,
                width: connInfo.length,
                height: connInfo.breadth,
                background: "#444",
            };
            return (
                <div className="line" style={lineStyle}>
                </div>
            );
        }
        else {
            let line1Style, line3Style;
            if(connInfo.length1 > 0) {
                line1Style = {
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
                width: connInfo.width2,
                height: connInfo.height2,
            };
            
            let a = connInfo.isClockwise ? connInfo.angle22 : connInfo.angle21;
            let b = Math.PI - connInfo.angle2;
            let sector2Style;
            const sector1WrapperStyle = {
                position: "absolute",
                left: 0,
                top: 0,
                transformOrigin: "50% 100%",
                transform: `rotate(${a}rad)`,
                width: "100%",
                height: "50%",
                overflow: "hidden",
            }

            if(connInfo.angle2 > Math.PI) {
                b += Math.PI;
                let c = (connInfo.isClockwise ? connInfo.angle21 : connInfo.angle22) - Math.PI;
                sector2Style = {
                    position: "absolute",
                    left: 0,
                    top: 0,
                    transform: `rotate(${c + Math.PI / 4}rad)`,
                    width: connInfo.width2 - connInfo.breadth * 2,
                    height: connInfo.height2 - connInfo.breadth * 2,
                    borderLeft: `solid ${connInfo.breadth}px #444`,
                    borderTop: `solid ${connInfo.breadth}px #444`,
                    borderRight: `solid ${connInfo.breadth}px transparent`,
                    borderBottom: `solid ${connInfo.breadth}px transparent`,
                    borderRadius: connInfo.width2 / 2,
                }
            }
            
            const sector1Style = {
                position: "absolute",
                left: 0,
                top: 0,
                transform: `rotate(${b + Math.PI / 4}rad)`,
                width: connInfo.width2 - connInfo.breadth * 2,
                height: connInfo.height2 - connInfo.breadth * 2,
                borderLeft: `solid ${connInfo.breadth}px #444`,
                borderTop: `solid ${connInfo.breadth}px #444`,
                borderRight: `solid ${connInfo.breadth}px transparent`,
                borderBottom: `solid ${connInfo.breadth}px transparent`,
                borderRadius: connInfo.width2 / 2,
            }


            if(connInfo.length3 > 0) {
                line3Style = {
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
    
            return (
                <>
                    {
                        connInfo.length1 > 0 &&
                        <div className="line1" style={line1Style}>
                        </div>
                    }
                    <div className="line2" style={line2Style}>
                        <div className="sector1Wrapper" style={sector1WrapperStyle}>
                            <div className="sector1" style={sector1Style}>
                            </div>
                        </div>
                        {
                            (connInfo.angle2 > Math.PI) && 
                            <div className="sector2" style={sector2Style}>
                            </div>
                        }
                    </div>
                    {
                        connInfo.length3 > 0 &&
                        <div className="line3" style={line3Style}>
                        </div>
                    }
                </>
            );
        }
    }
}

export default Conn;