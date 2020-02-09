import React, { Component, useEffect, useState } from 'react';
import Webex from 'webex';
import axios from 'axios';
import queryString from "query-string";
import { Column, Row } from 'simple-flexbox';
import Fab from '@material-ui/core/Fab';

import { useStateWithLocalStorage } from '../utils'

import Canvas from '../Canvas/Canvas'

import JSONBigInt from 'json-bigint';

import "./VideoCall.css";

// There's a few different events that'll let us know we should initialize
// Webex and start listening for incoming calls, so we'll wrap a few things
// up in a function.
function connect() {
    return new Promise((resolve) => {
        if (window.localStorage.webexId) {
            window.webex = Webex.init({
                config: {
                    meetings: {
                        deviceType: 'WEB'
                    }
                },
                credentials: {
                    access_token: window.localStorage.webexId
                }
            })
        }

        // Listen for added meetings
        window.webex.meetings.on('meeting:added', (addedMeetingEvent) => {
            if (addedMeetingEvent.type === 'INCOMING' || addedMeetingEvent.type === 'JOIN') {
                const addedMeeting = addedMeetingEvent.meeting;

                // Acknowledge to the server that we received the call on our device
                addedMeeting.acknowledge(addedMeetingEvent.type)
                    .then(() => {
                        if (window.confirm('Answer incoming call')) {
                            joinMeeting(addedMeeting);
                            bindMeetingEvents(addedMeeting);
                        }
                        else {
                            addedMeeting.decline();
                        }
                    });
            }
        });

        window.webex.meetings.on('meeting:removed', (addedMeetingEvent) => {
            console.log("Caught a deletion command");
        })


        // Register our device with Webex cloud
        if (!window.webex.meetings.registered) {
            window.webex.meetings.register()
                // Sync our meetings with existing meetings on the server
                .then(() => window.webex.meetings.syncMeetings())
                .then(() => {
                    // This is just a little helper for our selenium tests and doesn't
                    // really matter for the example
                    document.body.classList.add('listening');
                    document.getElementById('connection-status').innerHTML = 'connected';
                    // Our device is now connected
                    resolve();
                })
                .then(() => { console.log(window.webex.meetings.getAllMeetings()) })
                // This is a terrible way to handle errors, but anything more specific is
                // going to depend a lot on your app
                .catch((err) => {
                    console.error(err);
                    // we'll rethrow here since we didn't really *handle* the error, we just
                    // reported it
                    throw err;
                });
        }
        else {
            window.webex.meetings.syncMeetings()
            // Device was already connected
            resolve();
        }
    });
}

// Similarly, there are a few different ways we'll get a meeting Object, so let's
// put meeting handling inside its own function.
function bindMeetingEvents(meeting) {
    // call is a call instance, not a promise, so to know if things break,
    // we'll need to listen for the error event. Again, this is a rather naive
    // handler.
    meeting.on('error', (err) => {
        console.error(err);
    });

    // Handle media streams changes to ready state
    meeting.on('media:ready', (media) => {
        if (!media) {
            return;
        }
        if (media.type === 'local') {
            document.getElementById('self-view').srcObject = media.stream;
        }
        if (media.type === 'remoteVideo') {
            document.getElementById('remote-view-video').srcObject = media.stream;
        }
        if (media.type === 'remoteAudio') {
            document.getElementById('remote-view-audio').srcObject = media.stream;
        }
    });

    // Handle media streams stopping
    meeting.on('media:stopped', (media) => {
        // Remove media streams
        if (media.type === 'local') {
            document.getElementById('self-view').srcObject = null;
        }
        if (media.type === 'remoteVideo') {
            document.getElementById('remote-view-video').srcObject = null;
        }
        if (media.type === 'remoteAudio') {
            document.getElementById('remote-view-audio').srcObject = null;
        }
    });

    // Of course, we'd also like to be able to leave the meeting:
    document.getElementById('hangup').addEventListener('click', () => {
        meeting.leave();

    });

    meeting.on('all', (event) => {
        console.log(event);
    });
}

// Join the meeting and add media
function joinMeeting(meeting) {
    return meeting.join().then(() => {
        const mediaSettings = {
            receiveVideo: true,
            receiveAudio: true,
            receiveShare: false,
            sendVideo: true,
            sendAudio: true,
            sendShare: false
        };

        return meeting.getMediaStreams(mediaSettings).then((mediaStreams) => {
            const [localStream, localShare] = mediaStreams;

            meeting.addMedia({
                localShare,
                localStream,
                mediaSettings
            });
        });
    });
}


function VideoCall() {
    const [accountId, setAccountId] = useStateWithLocalStorage(
        'accountId'
    );
    const [webexId, setWebexId] = useStateWithLocalStorage(
        'webexId'
    );

    const [targetAccountId, setTargetAccountId] = useState(null);

    const [targetUser, setTargetUser] = useState(null);


    /* Execute this code once the component has loaded */
    useEffect(() => {

        /* Retrieve webex ID from backend and store in local storage */
        if (accountId) {
            axios.get('/profile/' + accountId, { transformResponse: [data => data] })
                .then(res => {
                    console.log(JSON.parse(res.data));

                    setWebexId(JSON.parse(res.data).webex_id)
                });
        }
        console.log(accountId);

    }, [accountId])

    useEffect(() => {
        if (!webexId) {
            return
        }
        /* All of the above code was copied over from the Webex docs.
           Following the steps in: https://github.com/webex/webex-js-sdk/blob/master/packages/node_modules/samples/browser-multi-party-call/app.js */
        window.webex = Webex.init({
            config: {
                meetings: {
                    deviceType: 'WEB'
                }
            },
            credentials: {
                access_token: webexId
            }
        })
        console.log(webexId);
    }, [webexId])

    /* Parse the account Id if specified as a target */
    useEffect(() => {
        if (queryString.parse(window.location.search).target) {
            setTargetAccountId(queryString.parse(window.location.search).target);
        }
    })

    /* Retrieve user data if one is specifying a target */
    useEffect(() => {
        if (targetAccountId) {
            console.log("TARGET ID: " + targetAccountId);

            axios.get('/profile/' + targetAccountId, { transformResponse: [data => data] })
                .then(res => {
                    setTargetUser(JSONBigInt.parse((res.data)))
                }).catch(err => {
                    console.err(err)
                });
        }
    }, [targetAccountId])

    useEffect(() => {
        let activeMeeting

        if (targetUser) {
            var el = document.getElementById('credentials'),
                elClone = el.cloneNode(true);

            el.parentNode.replaceChild(elClone, el);
        }

        /* Print out the ID we are using to authenticate. */
        console.log("------------------------------------------------------");

        // In order to simplify the state management needed to keep track of our button
        // handlers, we'll rely on the current meeting global object and only hook up event
        // handlers once.

        document.getElementById('hangup').addEventListener('click', () => {
            if (activeMeeting) {
                activeMeeting.leave();
            }
        });


        // Now, let's set up incoming call handling
        targetUser && document.getElementById('credentials').addEventListener('submit', (event) => {
            // let's make sure we don't reload the page when we submit the form
            event.preventDefault();

            console.log("Above Guy");


            // The rest of the incoming call setup happens in connect();
            connect().then(() => {
                console.log("Connected")
            })
                .catch((error) => {
                    console.log("ERROR while Connecting!")
                    // Report the error
                    console.error(error);

                    // Implement error handling here
                });
        });

        // And finally, let's wire up dialing
        !targetUser && document.getElementById('credentials').addEventListener('submit', (event) => {
            // again, we don't want to reload when we try to dial
            event.preventDefault();

            console.log("Below Guy");

            // const destination = document.getElementById('invitee').value;
            const destination = "studybuddy@webex.bot"

            // we'll use `connect()` (even though we might already be connected or
            // connecting) to make sure we've got a functional webex instance.
            connect()
                .then(() => {
                    // Create the meeting
                    return window.webex.meetings.create(destination).then((meeting) => {
                        // Save meeting
                        activeMeeting = meeting;

                        // Call our helper function for binding events to meetings
                        bindMeetingEvents(meeting);

                        // Pass the meeting to our join meeting helper
                        return joinMeeting(meeting);
                    });
                })
                .catch((error) => {
                    // Report the error
                    console.error(error);

                    // Implement error handling here
                });
        });
    }, [targetUser])

    return (
        <main className="Webex-container">
            <h1>Videochat with your Buddy</h1>
            <p>Call with your buddy and share wholesome knowledge!</p>

            {targetUser && <div className="user-padding"><h3>You are about to dial {targetUser.first_name}</h3><p>{targetUser.description}</p></div>}

            <div className="user-padding"></div>

            <Row horizontal='center'>
                {targetUser ? <form id="credentials">
                    <Fab type="submit" color={"primary"} variant={"extended"} type="submit">Ring {targetUser.first_name}</Fab>
                </form> :
                    < form id="credentials">
                        <Fab type="submit" color={"success"} variant={"extended"} type="submit">Connect to Webex</Fab>
                    </form>}
                <Fab disabled="true" id="connection-status" variant={"extended"}>disconnected</Fab>
                <Fab color={"secondary"} variant={"extended"} id="hangup">Hangup</Fab>
            </Row>

            <div className="user-padding"></div>

            <Row horizontal='center'>
                <div className="Webex-video-container">
                    <Column flexGrow={1} horizontal='center'>
                        <video className="Webex-video-stream" id="self-view" muted autoPlay></video>
                    </Column>
                    <Column flexGrow={1} horizontal='center'>
                        <div className="Webex-video-stream">
                            <audio id="remote-view-audio" autoPlay></audio>
                            <video id="remote-view-video" autoPlay></video>
                        </div>
                    </Column>
                </div>
            </Row>

            <div className="user-padding"></div>

            <Canvas />
        </main >
    );
}

export default VideoCall;