/* eslint-disable jsx-a11y/iframe-has-title */
import React, { useEffect, useState } from 'react'
import MinimizeIcon from "@mui/icons-material/Minimize";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import Box from '@mui/material/Box';
import useReprentativeStore from '../../store/representative';
import useTicketStore from '../../store/ticketStore';
import { Button, Typography } from '@mui/material';
import localforage from 'localforage';


const AgentLogin = ({ children }) => {
    const [iframeSrc, setIframeSrc] = useState('');
    const [hover, setHover] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Check if the iframe source URL is stored in local storage
                const storedSrc = await localforage.getItem('https://in-ccaas.ozonetel.com/toolbar_widget/index.html#login');
                if (storedSrc) {
                    // If the source URL is stored, set it as the iframeSrc state
                    setIframeSrc(storedSrc as string);
                } else {
                    // If the source URL is not stored, set a default source URL
                    setIframeSrc('https://in-ccaas.ozonetel.com/toolbar_widget/index.html#dashboard-agent'); // Replace url with your actual URL
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []); // Empty dependency array to run only once when the component mounts

    useEffect(() => {
        // Save the iframe source URL to local storage whenever it changes
        localforage.setItem('iframeSrc', iframeSrc).catch(error => {
            console.error('Error saving data:', error);
        });
    }, [iframeSrc]); // Dependency array includes iframeSrc

    const {
        agentLogin,
        setAgentLogin
    } = useTicketStore();

    const agentLoginCss = {
        display: agentLogin ? "" : 'none',
        position: "fixed",
        bottom: "7%",
        right: "2%",
        zIndex: "999999",
        border: "1px solid #66E6FF",
        borderRadius: 2,
        padding: 1,
        backgroundColor: "white",
        color: "black",
        width: "25vw",
        height: "67vh"
    };

    const agentLoginButton = {
        position: "fixed",
        bottom: "35%",
        right: "-4%",
        zIndex: "999999",
        border: "1px solid #ccc",
        padding: 1,
        color: "#ffff",
        width: '10vw',
        transform: "rotate(90deg)",
        opacity: hover ? 1 : 0.5,
        transition: 'opacity 0.3s ease',
    };


    const agentLoginText = {
        fontSize: '15px',
        fontWeight: 500,
        paddingTop: '10px'
    }

    return (
        <>
            <Box sx={agentLoginCss}>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        cursor: "pointer",
                        paddingBottom: 10
                    }}
                >
                    <div style={agentLoginText}>Agent Login</div>
                    <div>
                        <MinimizeIcon onClick={() => setAgentLogin(false)} />
                    </div>
                </div>
                <hr />
                <div>
                    <iframe
                        src={iframeSrc}
                        // title="Embedded Content"
                        width="100%"
                        height="400px" // Set initial height or use CSS for responsiveness
                        sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals allow-pointer-lock allow-orientation-lock allow-popups-to-escape-sandbox allow-presentation allow-top-navigation-by-user-activation allow-top-navigation"
                        allow="microphone; camera"
                    ></iframe>
                </div>
            </Box>
            {!agentLogin && (
                <Button
                    variant="contained"
                    onClick={() => setAgentLogin(true)}
                    sx={agentLoginButton}
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                >
                    <SupportAgentIcon />  Agent login
                </Button>
            )}
            {children}
        </>
    )
}

export default AgentLogin
