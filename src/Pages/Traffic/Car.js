import React from "react";

class Car extends React.Component {
    render() {
        const {
            width,
            height,
            colors,
        } = this.props;

        const carStyle = {
            width: width,
            height: height,
        }
        
        const bodyStyle = {
            width: width,
            height: height,
            background: colors.body,
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