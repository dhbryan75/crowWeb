import React from "react";

import "./Bird.css";


class Bird extends React.Component {
    render() {
        const { 
            isRight,
            size,
            colors,
        } = this.props;

        const birdStyle = {
            width: size,
            height: size,
        };
        const bodyStyle = {
            width: size,
            height: size,
            background: colors.body,
        };
        const eyeStyle = {
            background: colors.eye,
        };
        const leftEyeStyle = isRight ? {
            left: "60%",
        } : {
            right: "60%",
        };
        const rightEyeStyle = isRight ? {
            left: "80%",
        } : {
            right: "80%",
        };
        const pupilStyle = {
            background: colors.pupil,
        };
        const leftPupilStyle = isRight ? {
            left: "67.5%",
        } : {
            right: "67.5%",
        };
        const rightPupilStyle = isRight ? {
            left: "87.5%",
        } : {
            right: "87.5%",
        };
        const beakStyle = isRight ? {
            left: "75%",
            borderLeft: `solid ${0.2 * size}px ${colors.beak}`,
            borderTop: `solid ${0.1 * size}px transparent`,
            borderBottom: `solid ${0.1 * size}px transparent`,
            borderRadius: "50% 0 0 50%",
        } : {
            right: "75%",
            borderRight: `solid ${0.2 * size}px ${colors.beak}`,
            borderTop: `solid ${0.1 * size}px transparent`,
            borderBottom: `solid ${0.1 * size}px transparent`,
            borderRadius: "0 50% 50% 0",
        };
        const wing1Style = isRight ? {
            left: "-10%",
            borderRadius: "100% 0 0 0",
            background: colors.wing1,
        } : {
            right: "-10%",
            borderRadius: "0 100% 0 0",
            background: colors.wing1,
        };
        const wing2Style = isRight ? {
            left: "40%",
            borderRadius: "0 100% 100% 0 / 0 30% 30% 0",
            background: colors.wing2,
        } : {
            right: "40%",
            borderRadius: "100% 0 0 100% / 30% 0 0 30%",
            background: colors.wing2,
        };
        const hairStyle = {};
        const leftHairStyle = isRight ? {
            left: "40%",
            borderTop: `solid ${0.05 * size}px ${colors.hair}`,
            borderRight: `solid ${0.05 * size}px ${colors.hair}`,
            borderRadius: "0 100% 0 0",
        } : {
            right: "40%",
            borderTop: `solid ${0.05 * size}px ${colors.hair}`,
            borderLeft: `solid ${0.05 * size}px ${colors.hair}`,
            borderRadius: "100% 0 0 0",
        };
        const rightHairStyle = isRight ? {
            left: "45%",
            borderTop: `solid ${0.05 * size}px ${colors.hair}`,
            borderLeft: `solid ${0.05 * size}px ${colors.hair}`,
            borderRadius: "100% 0 0 0",
        } : {
            right: "45%",
            borderTop: `solid ${0.05 * size}px ${colors.hair}`,
            borderRight: `solid ${0.05 * size}px ${colors.hair}`,
            borderRadius: "0 100% 0 0",
        };
        const legStyle = {
            background: colors.leg,
        };
        const leftLegStyle = isRight ? {
            left: "45%",
        } : {
            right: "45%",
        };
        const rightLegStyle = isRight ? {
            left: "55%",
        } : {
            right: "55%",
        };
        const feetStyle = isRight ? {
            left: "40%",
            background: colors.feet,
        } : {
            right: "40%",
            background: colors.feet,
        };

        return (
            <div className="bird" style={birdStyle}>
                <div className="body" style={bodyStyle}>
                    <div className="left eye" style={{...eyeStyle, ...leftEyeStyle}}/>
                    <div className="right eye" style={{...eyeStyle, ...rightEyeStyle}}/>
                    <div className="left pupil" style={{...pupilStyle, ...leftPupilStyle}}/>
                    <div className="right pupil" style={{...pupilStyle, ...rightPupilStyle}}/>
                    <div className="beak" style={beakStyle}/>
                    <div className="wing1" style={wing1Style}/>
                    <div className="wing2" style={wing2Style}/>
                    <div className="left hair" style={{...hairStyle, ...leftHairStyle}}/>
                    <div className="right hair" style={{...hairStyle, ...rightHairStyle}}/>
                    <div className="left leg" style={{...legStyle, ...leftLegStyle}}/>
                    <div className="right leg" style={{...legStyle, ...rightLegStyle}}/>
                    <div className="feet"style={feetStyle}/>
                </div>
            </div>
        );
    }
}

export default Bird;