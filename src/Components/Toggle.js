import React from "react";

class Toggle extends React.Component {
    render() {
        const { 
            keyWidth,
            toggleWidth,
            height,
            borderWidth,
            borderRadius,
            color,
            fontColor,
            fontSize,
            text,
            type,
            value,
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
        
        const toggleStyle = {
            position: "relative",
            marginLeft: toggleWidth * 0.2,
            width: toggleWidth,
            height: height,
        }
        

        return (
            <label>
                <div className="key" style={keyStyle}>
                    {text}
                </div>
                <div className="toggle" style={toggleStyle}>
                    <div style={{
                        position: "absolute",
                        left: toggleWidth * 0.2,
                        top: height * 0.25,
                        width: toggleWidth * 0.6,
                        height: height * 0.5,
                        borderRadius: height * 0.25,
                        background: "#fff",
                    }}>
                    </div>
                    <div style={{
                        position: "absolute",
                        left: value ? 0 : toggleWidth - height * 0.8,
                        top: height * 0.1,
                        width: height * 0.8,
                        height: height * 0.8,
                        borderRadius: "50%",
                        background: value ? "#0f0" : "#f00",
                        transition: ".2s",
                    }}></div>
                </div>
                <input 
                    className="input" 
                    type={type}
                    defaultChecked={value}
                    onChange={onChange}
                    style={{display: "none"}}
                />
            </label>
        );
    }
}

export default Toggle;