import React from "react";


class Hexagon extends React.Component {
    render() {
        const {
            size,
            color,
            verticalRatio,
        } = this.props;
        const ratio = verticalRatio || 1;

        const hexagonStyle = {
            position: "relative",
            width: 2 * size,
            height: ratio * 1.732 * size,
        };
        const leftStyle = {
            position: "absolute",
            left: 0,
            top: 0,
            borderRight: `solid ${0.5 * size}px ${color}`,
            borderTop: `solid ${ratio * 0.866 * size}px transparent`,
            borderBottom: `solid ${ratio * 0.866 * size}px transparent`,
        };
        const centerStyle = {
            position: "absolute",
            left: 0.5 * size,
            top: 0,
            width: size,
            height: ratio * 1.732 * size,
            background: color,
        };
        const rightStyle = {
            position: "absolute",
            left: 1.5 * size,
            top: 0,
            borderLeft: `solid ${0.5 * size}px ${color}`,
            borderTop: `solid ${ratio * 0.866 * size}px transparent`,
            borderBottom: `solid ${ratio * 0.866 * size}px transparent`,
        };

        return (
            <div className="hexagon" style={hexagonStyle}>
                <div className="left" style={leftStyle}/>
                <div className="center" style={centerStyle}/>
                <div className="right" style={rightStyle}/>
            </div>
        );
    }
}

export default Hexagon;