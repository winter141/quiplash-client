import {useEffect} from "react";

const useSpeechSynthesisHook = (
    messages: string[],
    onEndCallBack: (messageIndex: number) => void,
    onDoneCallback: () => void
): void => {
    useEffect(  () => {
        function speakMessage(messageIndex: number) {
            if (messageIndex >= messages.length) {
                onDoneCallback();
                return;
            }

            const utterance = new SpeechSynthesisUtterance(messages[messageIndex]);
            utterance.onend = () => {
                onEndCallBack(messageIndex);
                return speakMessage(messageIndex + 1);
            };
            speechSynthesis.speak(utterance);
        }

        speakMessage(0);

        return () => {
            window.speechSynthesis.cancel();
        };
    }, []);
};


export {useSpeechSynthesisHook}
