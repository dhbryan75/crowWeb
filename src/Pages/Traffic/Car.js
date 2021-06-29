import React from "react";

class Car extends React.Component {
    render() {
        const {
            carInfo,
        } = this.props;

        const carStyle = {
            position: "absolute",
            left: carInfo.left,
            top: carInfo.top,
            transform: `rotate(${carInfo.angle}rad)`,
            zIndex: carInfo.roadInfo.zIndex + 3,
            width: carInfo.length,
            height: carInfo.breadth,
        }
        
        const bodyStyle = {
            width: carInfo.length,
            height: carInfo.breadth,
            background: carInfo.colors.body,
            borderRadius: 7,
        }

        return (
            <div className="car" style={carStyle}>
                <div className="body" style={bodyStyle}>

                </div>
            </div>
        )
    }
}

export default Car;