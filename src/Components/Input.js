import React from "react";

class Input extends React.Component {
    render() {
        const { 
            keyWidth,
            inputWidth,
            height,
            borderWidth,
            borderRadius,
            color,
            fontColor,
            fontSize,
            text,
            type,
            value,
            step,
            onChange,
        } = this.props;
        
        const keyStyle = {
            width: keyWidth,
            height: height,
            border: `solid ${borderWidth}px #000`,
            borderRadius: `${borderRadius}px 0 0 ${borderRadius}px`,
            background: color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: fontColor,
            fontSize: fontSize,
            fontWeight: "bold",
            userSelect: "none",
        }

        const inputStyle = {
            marginLeft: -borderWidth,
            width: inputWidth,
            height: height,
            border: `solid ${borderWidth}px #000`,
            borderRadius: `0 ${borderRadius}px ${borderRadius}px 0`,
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#000",
            fontSize: fontSize,
            fontWeight: "bold",
        };

        return (
            <>
                <div className="key" style={keyStyle}>
                    {text}
                </div>
                <input 
                    className="input" 
                    type={type}
                    value={value}
                    onChange={onChange}
                    step={step || 1}
                    style={inputStyle}
                />
            </>
        );
    }
}

export default Input;