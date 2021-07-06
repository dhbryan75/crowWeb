import React from "react";

class Car extends React.Component {
    render() {
        const {
            carInfo,
            isSelecting,
        } = this.props;

        let carStyle = {
            position: "absolute",
            left: carInfo.left,
            top: carInfo.top,
            transform: `rotate(${carInfo.angle}rad)`,
            zIndex: carInfo.zIndex,
            width: carInfo.length,
            height: carInfo.breadth,
        }
        if(isSelecting) {
            carStyle["opacity"] = carInfo.isSelected() ? 1 : 0.5;
        }

        const bodyStyle = {
            width: carInfo.length,
            height: carInfo.breadth,
            background: carInfo.colors.body,
            borderRadius: 5,
        }

        return (
            <div 
                className="car" 
                onClick={isSelecting ? carInfo.onClick : undefined}
                style={carStyle}
            >
                <div className="body" style={bodyStyle}>

                </div>
            </div>
        )
    }
}

export default Car;