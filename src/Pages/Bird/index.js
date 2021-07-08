import React from "react";

import Bird from "../../Components/Bird";
import { crowColors, parrotColors, flamingoColors, chickenColors } from "../../Assets/Constants";
import { delay } from "../../Assets/Functions";


const interval = 15;

var birdSize = 0;

const wingMoveDuration = 1500;
const wingDys = [0, 1, 2, 3, 4, 3, 2, 1, 0, -1, -2, -3, -4, -3, -2, -1];

var birdInfos = [
    {
        idx: 0,
        key: "flamingo",
        colors: flamingoColors,
        x: 0,
        y: 0,
        isRight: false,
        pupilDy: 0,
        wingDyIdx: 0,
    },
    {
        idx: 1,
        key: "crow",
        colors: crowColors,
        x: 0,
        y: 0,
        isRight: false,
        pupilDy: 0,
        wingDyIdx: 0,
    },
    {
        idx: 2,
        key: "parrot",
        colors: parrotColors,
        x: 0,
        y: 0,
        isRight: false,
        pupilDy: 0,
        wingDyIdx: 0,
    },
    {
        idx: 3,
        key: "chicken",
        colors: chickenColors,
        x: 0,
        y: 0,
        isRight: false,
        pupilDy: 0,
        wingDyIdx: 0,
    },
];



class BirdPage extends React.Component {
    state = {
        birdInfos,
    };

    moveWing = async(birdInfo) => {
        for(let iteration = 0; iteration < wingMoveDuration / interval; iteration++) {
            birdInfo.wingDyIdx += 1;
            birdInfo.wingDyIdx %= wingDys.length;
            this.setState({
                ...this.state,
                birdInfos,
            });
            await delay(interval);
        }
        birdInfo.wingDyIdx = 0;
        this.setState({
            ...this.state,
            birdInfos,
        });
    }
    
    onMouseMove = e => {
        let x = e.clientX;
        let y = e.clientY;
        birdInfos.forEach(birdInfo => {
            birdInfo.isRight = birdInfo.x < x;
            if(y < birdInfo.y - birdSize / 2) {
                birdInfo.pupilDy = 3;
            }
            else if(y > birdInfo.y + birdSize / 2) {
                birdInfo.pupilDy = -3;
            }
            else {
                birdInfo.pupilDy = 0;
            }
        });
        this.setState({
            ...this.state,
            birdInfos,
        });
    }

    render() {
        const { width, height } = this.props;

        const { 
            birdInfos,
        } = this.state;

        birdInfos.forEach(birdInfo => {
            birdInfo.x = width * (birdInfo.idx * 2 + 1) / 8;
            birdInfo.y = height / 2;
        });

        birdSize = width * 0.15;

        const birdsStyle = {
            width: width,
            height: height,
            display: "flex",
            background: "#ccc",
        }

        const birdStyle = {
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        }

        let birds = birdInfos.map(birdInfo => {
            const onClick = e => {
                this.moveWing(birdInfo);
            }
            return (
                <div 
                    className={birdInfo.key} 
                    key={birdInfo.key} 
                    onClick={onClick}
                    style={birdStyle}>
                    <Bird
                        isRight={birdInfo.isRight}
                        size={birdSize}
                        colors={birdInfo.colors}
                        wingDy={wingDys[birdInfo.wingDyIdx]}
                        pupilDy={birdInfo.pupilDy}
                    />
                </div>
            );
        })

        return (
            <div 
                className="birds" 
                onMouseMove={this.onMouseMove}
                style={birdsStyle}
            >
                {birds}
            </div>
        );
    }
}


export default BirdPage;