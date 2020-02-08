import React, { Component, useEffect } from 'react';
import Webex from 'webex';
import axios from 'axios';


import { useStateWithLocalStorage } from '../utils'

import "./VideoCall.css";

function VideoCall() {
    const [accountId, setAccountId] = useStateWithLocalStorage(
        'accountId'
    );
    const [webexId, setWebexId] = useStateWithLocalStorage(
        'webexId'
    );


    /* Execute this code once the component has loaded */
    useEffect(() => {

        /* Retrieve webex ID from backend and store in local storage */
        if (accountId) {
            axios.get('/profile/' + accountId)
                .then(res => {
                    setWebexId(res.data.brief.webex_id)
                });
        }
        console.log(accountId);

    }, [accountId])

    useEffect(() => {
        /* All of the above code was copied over from the Webex docs.
           Following the steps in: https://developer.webex.com/docs/sdks/browser */
        const webex = Webex.init({
            credentials: {
                access_token: webexId
            }
        });

        console.log(webexId);

        webex.meetings.register()
            .catch((err) => {
                console.error(err);
                alert(err);
                throw err;
            });

        function bindMeetingEvents(meeting) {
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

                // Get our local media stream and add it to the meeting
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

        document.getElementById('destination').addEventListener('submit', (event) => {
            // again, we don't want to reload when we try to join
            event.preventDefault();

            const destination = document.getElementById('invitee').value;

            return webex.meetings.create(destination).then((meeting) => {
                // Call our helper function for binding events to meetings
                bindMeetingEvents(meeting);

                return joinMeeting(meeting);
            })
                .catch((error) => {
                    // Report the error
                    console.error(error);
                });
        });
    }, [webexId])

    return (
        <main className="Webex-container">
            <h1>Meetings Quick Start</h1>
            <p>This sample demonstrates how to start a meeting using Webex JS-SDK in the browser.</p>

            <input
                id="accountIdInput"
                name="accountIdInput"
                placeholder="Insert to change AccountId"
                type="text"
                value={accountId}
                onChange={event => setAccountId(event.target.value)} />

            <form id="destination">
                <input
                    id="invitee"
                    name="invitee"
                    placeholder="Person ID or Email Address or SIP URI or Room ID"
                    type="text" />
                <input title="join" type="submit" value="join" />
            </form>

            <div className="Webex-video-container">
                <video className="Webex-video-stream" id="self-view" muted autoPlay></video>
                <div className="Webex-video-stream">
                    <audio id="remote-view-audio" autoPlay></audio>
                    <video id="remote-view-video" autoPlay></video>
                </div>
            </div>

            <button id="hangup" title="hangup" type="button">cancel/hangup</button>
        </main>
    );
}

export default VideoCall;