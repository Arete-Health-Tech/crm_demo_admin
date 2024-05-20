import React, { useEffect, useRef, useState } from "react";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CheckEmptyIcon from "../../../../assets/Checkbox-null.svg";
import CheckFilledIcon from "../../../../assets/Checkbox-Final.svg";

import "../../singleTicket.css";
import { Grid, Stack } from "@mui/material";

function Accordion(props) {
    const [active, setActive] = useState(false);
    const [isChecked, setisChecked] = useState(false);
    const content = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState("0px");
    const [arrowRotation, setArrowRotation] = useState(0);

    // useEffect(() => {
    //     console.log("Height for ", props.title, ": ", height);
    // }, [height]);

    function toggleAccordion() {
        setActive(!active);
        setHeight(active ? "0px" : `${content?.current?.scrollHeight}px`);
        setArrowRotation(active ? 0 : 180);
    }

    const handleChecked = () => {

    }

    return (
        <Grid container>
            <Grid item xs={12}>
                <div className="accordion__section">
                    <div
                        className={`accordion ${active ? "active" : ""}`} >
                        <Stack sx={{ padding: "3px 10px 0px 8px" }} onClick={() => { setisChecked(!isChecked) }}>
                            {isChecked ? <img src={CheckFilledIcon} /> : <img src={CheckEmptyIcon} />}
                        </Stack>
                        <p style={{ textDecoration: isChecked ? "line-through" : "none" }}
                            onClick={toggleAccordion} className="accordion__title"
                        >{props.title}</p>
                        <span onClick={toggleAccordion}
                            style={{ padding: "0 6px 4px 0" }}
                        >
                            <ArrowDropDownIcon
                                style={{
                                    transform: `rotate(${arrowRotation}deg)`,
                                    transition: 'transform 0.3s ease',
                                }} /></span>

                    </div>
                    <div className="accordion_info">
                        <Stack className="record-tag "> {props.date}</Stack>
                        <Stack className="record-tag time-tag"> {props.time}</Stack>
                    </div>
                    <div
                        ref={content}
                        style={{ maxHeight: `${height}` }}
                        className="accordion__content"
                    >
                        <div
                            className="accordion__text"
                            dangerouslySetInnerHTML={{ __html: props.content }}
                        />
                    </div>
                </div>
            </Grid>
        </Grid>
    );
}

export default Accordion;
