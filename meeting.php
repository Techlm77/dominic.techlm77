<?php
session_start();

if (!isset($_GET['meetingId']) || !isset($_GET['displayName'])) {
    header("Location: index.php");
    exit;
}

$meetingId = $_GET['meetingId'];
$displayName = $_GET['displayName'];
?>

<!DOCTYPE html>
<html>

<head>
    <title><?php echo $meetingId; ?></title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        video {
            border: 1px solid #ddd;
            border-radius: 5px;
            box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
            height: 50%;
            width: 50%;
        }
    </style>
</head>

<body>
    <video id="remote-video" autoplay></video>

    <script>
        const remoteVideo = document.getElementById('remote-video');
        const wsUrl = 'wss://' + window.location.hostname + ':8443';

        let peerConnection;
        let signalingSocket;

        let started = false;

        function initSignaling() {
            signalingSocket = new WebSocket(wsUrl);

            signalingSocket.addEventListener('open', () => {
                console.log('Signaling server connected');
            });

            signalingSocket.addEventListener('message', async (event) => {
                console.log('Signaling server message', event.data);
                const message = JSON.parse(event.data);

                switch (message.type) {
                    case 'offer':
                        await handleOffer(message.data);
                        break;
                    case 'answer':
                        await handleAnswer(message.data);
                        break;
                    case 'ice_candidate':
                        handleIceCandidate(message.data);
                        break;
                }
            });

            signalingSocket.addEventListener('close', () => {
                console.log('Signaling server disconnected');
            });
        }

        async function handleOffer(data) {
            createPeerConnection();

            await peerConnection.setRemoteDescription(new RTCSessionDescription({
                type: 'offer',
                sdp: data.sdp
            }));

            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);

            signalingSocket.send(JSON.stringify({
                type: 'answer',
                data: {
                    meetingId: '<?php echo $meetingId; ?>',
                    displayName: '<?php echo $displayName; ?>',
                    sdp: peerConnection.localDescription.sdp
                }
            }));
        }

        async function handleAnswer(data) {
            await peerConnection.setRemoteDescription(new RTCSessionDescription({
                type: 'answer',
                sdp: data.sdp
            }));
        }

        function handleIceCandidate(data) {
            peerConnection.addIceCandidate(new RTCIceCandidate(data.ice_candidate));
        }

        function createPeerConnection() {
            peerConnection = new RTCPeerConnection();

            peerConnection.addEventListener('icecandidate', (event) => {
                console.log('ICE candidate', event.candidate);
                if (event.candidate) {
                    signalingSocket.send(JSON.stringify({
                        type: 'ice_candidate',
                        data: {
                            meetingId: '<?php echo $meetingId; ?>',
                            displayName: '<?php echo $displayName; ?>',
                            ice_candidate: event.candidate
                        }
                    }));
                }
            });

            peerConnection.addEventListener('track', (event) => {
                console.log('Track event', event);
                remoteVideo.srcObject = event.streams[0];
            });
        }

        initSignaling();
    </script>
</body>

</html>