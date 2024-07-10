import {useEffect} from "react";

const useSpeechSynthesisHook = (
    messages: string[],
    onEndCallBack: (messageIndex: number) => void,
    onDoneCallback: () => void,
    ...awaitingDependencies: boolean[]
): void => {
    useEffect(  () => {
        if (awaitingDependencies.some(dependency => !dependency)) {
            return;
        }

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
    }, [...awaitingDependencies]);
};

export {useSpeechSynthesisHook}
