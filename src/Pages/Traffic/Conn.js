import React from "react";

class Conn extends React.Component {
    render() {
        const {
            connInfo,
            isSelecting,
        } = this.props;

        let connStyle = {
            zIndex: connInfo.zIndex,
        }
        if(isSelecting) {
            connStyle["opacity"] = connInfo.isSelected() ? 1 : 0.5;
        }

        if(connInfo.isStraight) {
            const lineStyle = {
                position: "absolute",
                left: connInfo.left,
                top: connInfo.top,
                transform: `rotate(${connInfo.angle}rad)`,
                width: connInfo.length,
                height: connInfo.breadth,
                background: "#333",
            };
            return (
                <div className="conn" style={connStyle}>
                    <div className="line" onClick={isSelecting ? connInfo.onClick : undefined} style={lineStyle}>
                    </div>
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
                    width: connInfo.length1,
                    height: connInfo.breadth,
                    background: "#333",
                };
            }


            const line2Style = {
                position: "absolute",
                left: connInfo.left2,
                top: connInfo.top2,
                width: connInfo.width2,
                height: connInfo.height2,
            };
            
            let a = connInfo.isClockwise ? connInfo.angle22 : connInfo.angle21;
            let b = Math.PI - connInfo.angle2;
            
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

            let sector2Style;
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
                    borderLeft: `solid ${connInfo.breadth}px #333`,
                    borderTop: `solid ${connInfo.breadth}px #333`,
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
                borderLeft: `solid ${connInfo.breadth}px #333`,
                borderTop: `solid ${connInfo.breadth}px #333`,
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
                    width: connInfo.length3,
                    height: connInfo.breadth,
                    background: "#333",
                };
            }
    
            return (
                <div className="conn" style={connStyle}>
                    {
                        connInfo.length1 > 0 &&
                        <div className="line1" onClick={isSelecting ? connInfo.onClick : undefined} style={line1Style}>
                        </div>
                    }
                    <div className="line2" style={line2Style}>
                        <div className="sector1Wrapper" style={sector1WrapperStyle}>
                            <div className="sector1" onClick={isSelecting ? connInfo.onClick : undefined} style={sector1Style}>
                            </div>
                        </div>
                        {
                            (connInfo.angle2 > Math.PI) && 
                            <div className="sector2" onClick={isSelecting ? connInfo.onClick : undefined} style={sector2Style}>
                            </div>
                        }
                    </div>
                    {
                        connInfo.length3 > 0 &&
                        <div className="line3" onClick={isSelecting ? connInfo.onClick : undefined} style={line3Style}>
                        </div>
                    }
                </div>
            );
        }
    }
}

export default Conn;