import React from "react";

class Button extends React.Component {
    render() {
        const { 
            width,
            height,
            borderWidth,
            borderRadius,
            color,
            fontColor,
            fontSize,
            text,
            onClick,
            onMouseOver,
            onMouseOut,
        } = this.props;

        const buttonStyle = {
            width: width,
            height: height,
            border: borderWidth ? `solid ${borderWidth}px #000` : "unset",
            borderRadius: borderRadius,
            background: color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: fontColor,
            fontSize: fontSize,
            fontWeight: "bold",
            userSelect: "none",
        };

        return (
            <div 
                className="button" 
                onClick={onClick}
                onMouseOver={onMouseOver}
                onMouseOut={onMouseOut}
                style={buttonStyle}
            >
                {text}
            </div>
        );
    }
}

export default Button;