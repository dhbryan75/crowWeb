import React from "react";

class Bird extends React.Component {
    render() {
        const { 
            isRight,
            size,
            colors,
            wingDy,
            pupilDy,
        } = this.props;

        let bodyStyle = {
            position: "absolute",
            width: size,
            height: size,
            borderRadius: "25%",
            background: colors.body,
            boxShadow: `0 0 ${size * 0.1}px`,
        };

        let eyeStyle = {
            position: "absolute",
            top: "20%",
            width: "15%",
            height: "35%",
            borderRadius: "50% / 21%",
            background: colors.eye,
        };

        let leftEyeStyle = {
            ...eyeStyle,
        };
        leftEyeStyle[isRight ? "left" : "right"] = "60%";
        
        let rightEyeStyle = {
            ...eyeStyle,
        };
        rightEyeStyle[isRight ? "left" : "right"] = "80%";

        let pupilStyle = {
            position: "absolute",
            top: `${30 - (pupilDy || 0)}%`,
            width: "5%",
            height: "15%",
            borderRadius: "50% / 20%",
            background: colors.pupil,
        };

        let leftPupilStyle = {
            ...pupilStyle,
        };
        leftPupilStyle[isRight ? "left" : "right"] = "67.5%"

        let rightPupilStyle = {
            ...pupilStyle,
        };
        rightPupilStyle[isRight ? "left" : "right"] = "87.5%"

        let beakStyle = {
            position: "absolute",
            top: "50%",
            borderTop: `solid ${0.1 * size}px transparent`,
            borderBottom: `solid ${0.1 * size}px transparent`,
        };
        beakStyle[isRight ? "left" : "right"] = "75%";
        beakStyle[isRight ? "borderLeft" : "borderRight"] = `solid ${0.2 * size}px ${colors.beak}`;
        beakStyle["borderRadius"] = isRight ? "50% 0 0 50%" : "0 50% 50% 0";

        let wing1Style = {
            position: "absolute",
            top: `${40 - (wingDy || 0)}%`,
            width: "50%",
            height: "50%",
            background: colors.wing1,
        };
        wing1Style[isRight ? "left" : "right"] = "-10%";
        wing1Style["borderRadius"] = isRight ? "100% 0 0 0" : "0 100% 0 0";

        let wing2Style = {
            position: "absolute",
            top: `${40 - (wingDy || 0)}%`,
            width: "15%",
            height: "50%",
            background: colors.wing2,
        };
        wing2Style[isRight ? "left" : "right"] = "40%";
        wing2Style["borderRadius"] = isRight ? "0 100% 100% 0 / 0 30% 30% 0" : "100% 0 0 100% / 30% 0 0 30%";

        let hairStyle = {
            position: "absolute",
            top: "-10%",
            width: "5%",
            height: "5%",
            borderTop: `solid ${0.05 * size}px ${colors.hair}`,
        };

        let leftHairStyle = {
            ...hairStyle,
        };
        leftHairStyle[isRight ? "left" : "right"] = "42.5%";
        leftHairStyle[isRight ? "borderRight" : "borderLeft"] = `solid ${0.05 * size}px ${colors.hair}`;
        leftHairStyle["borderRadius"] = isRight ? "0 100% 0 0" : "100% 0 0 0";
        
        let rightHairStyle = {
            ...hairStyle,
        };
        rightHairStyle[isRight ? "left" : "right"] = "47.5%";
        rightHairStyle[isRight ? "borderLeft" : "borderRight"] = `solid ${0.05 * size}px ${colors.hair}`;
        rightHairStyle["borderRadius"] = isRight ? "100% 0 0 0" : "0 100% 0 0";
        

        let legStyle = {
            position: "absolute",
            top: "100%",
            width: "5%",
            height: "5%",
            background: colors.leg,
        };

        let leftLegStyle = {
            ...legStyle,
        };
        leftLegStyle[isRight ? "left" : "right"] = "42.5%";
        
        let rightLegStyle = {
            ...legStyle,
        };
        rightLegStyle[isRight ? "left" : "right"] = "52.5%";

        let feetStyle = {
            position: "absolute",
            top: "105%",
            width: "25%",
            height: "5%",
            borderRadius: "20% 20% 0 0 / 100% 100% 0 0",
            background: colors.feet,
        };
        feetStyle[isRight ? "left" : "right"] = "37.5%";

        return (
            <div className="body" style={bodyStyle}>
                <div className="left eye" style={leftEyeStyle}/>
                <div className="right eye" style={rightEyeStyle}/>
                <div className="left pupil" style={leftPupilStyle}/>
                <div className="right pupil" style={rightPupilStyle}/>
                <div className="beak" style={beakStyle}/>
                <div className="wing1" style={wing1Style}/>
                <div className="wing2" style={wing2Style}/>
                <div className="left hair" style={leftHairStyle}/>
                <div className="right hair" style={rightHairStyle}/>
                <div className="left leg" style={leftLegStyle}/>
                <div className="right leg" style={rightLegStyle}/>
                <div className="feet" style={feetStyle}/>
            </div>
        );
    }
}

export default Bird;