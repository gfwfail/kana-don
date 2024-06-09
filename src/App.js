import React, {useState, useEffect, useRef} from 'react';
import {kanaGroups, getRandomKana} from './kanaUtils';

const useLocalStorageState = (key, defaultValue) => {
    const [state, setState] = useState(() => {
        const storedValue = localStorage.getItem(key);
        return storedValue ? JSON.parse(storedValue) : defaultValue;
    });

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(state));
    }, [key, state]);

    return [state, setState];
};


const initializeKanaData = (selectedTypes, selectedGroups, kanaData = null) => {
    if (selectedTypes.length > 0 && selectedGroups.length > 0) {
        let newKana = getRandomKana(selectedTypes, selectedGroups);
        while (newKana === kanaData) {
            console.log('initializeKanaData - Duplicate Kana:', newKana); // Debug log
            newKana = getRandomKana(selectedTypes, selectedGroups);
        }
        return newKana;
    }

    return null;
};

const handleInputChange = (e, index, input, setInput, inputRefs, inputRef) => {
    const value = e.target.value.replace(/[^a-zA-Z]/g, '');
    const newInput = [...input];
    newInput[index] = value;
    setInput(newInput);
    inputRef.current = newInput; // Update the ref
    console.log('handleInputChange - New Input:', newInput); // Debug log

    if (value && index < input.length - 1) {
        inputRefs.current[index + 1].focus();
    }
};

const handleKeyDownInput = (e, index, input, inputRefs) => {
    if (e.key === 'Backspace' && !input[index] && index > 0) {
        inputRefs.current[index - 1].focus();
    }
};

// Main Component
const KanaChecker = () => {
    const [selectedTypes, setSelectedTypes] = useLocalStorageState('selectedTypes', ['hiragana', 'katakana']);
    const [selectedGroups, setSelectedGroups] = useLocalStorageState('selectedGroups', Object.keys(kanaGroups.hiragana));
    const [kanaData, setKanaData] = useState(initializeKanaData(selectedTypes, selectedGroups));
    const [input, setInput] = useState(['', '', '']);
    const [result, setResult] = useState(null);
    const [showAnswer, setShowAnswer] = useState(false);
    const [correctCount, setCorrectCount] = useState(0);
    const [incorrectCount, setIncorrectCount] = useState(0);
    const [incorrectList, setIncorrectList] = useState([]);
    const inputRefs = useRef([]);
    const inputRef = useRef(input); // Ref to track current input state
    const audioRef = useRef(null); // Ref for audio element


    useEffect(() => {
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
        console.log(kanaData)
    }, [kanaData]);

    useEffect(() => {
        const handleGlobalKeyDown = (e) => {
            if (e.key === 'Enter') {
                console.log(kanaData)
                if (result === null) {
                    handleSubmit();
                } else {
                    handleNewKana();
                }
            }
        };

        window.addEventListener('keydown', handleGlobalKeyDown);

        return () => {
            window.removeEventListener('keydown', handleGlobalKeyDown);
        };
    }, [result]);

    const handleSubmit = () => {
        if (kanaData) {
            const userInput = inputRef.current.join('').toLowerCase().trim();
            if (!userInput) {
                console.log('handleSubmit - User Input is empty'); // Debug log
                return;
            }
            console.log('handleSubmit - User Input:', userInput); // Debug log
            console.log('handleSubmit - Expected Romaji:', kanaData.romaji.toLowerCase().trim()); // Debug log
            const isCorrect = userInput === kanaData.romaji.toLowerCase().trim();
            setResult(isCorrect);

            if (isCorrect) {
                setCorrectCount((prev) => prev + 1);
            } else {
                setIncorrectCount((prev) => prev + 1);
                setIncorrectList((prev) => [
                    ...prev,
                    {kana: kanaData.kana, userInput: userInput, correctAnswer: kanaData.romaji}
                ]);
                setShowAnswer(true);
            }
        }
    };

    const handleNewKana = () => {
        setKanaData(initializeKanaData(selectedTypes, selectedGroups, kanaData));
        setInput(['', '', '']);
        inputRef.current = ['', '', '']; // Reset the ref
        setResult(null);
        setShowAnswer(false);
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    };

    const toggleShowAnswer = () => setShowAnswer((prev) => !prev);

    const handleCheckboxChange = (setStateFunction, value) => {
        setStateFunction((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]));
    };

    const playAudio = () => {
        if (audioRef.current) {
            audioRef.current.play();
        }
    };

    return (
        <div
            className="flex flex-col items-center p-6 bg-white shadow-md rounded-lg max-w-lg mx-auto mt-10 border border-gray-300">
            <div className="flex items-center mb-6">
                <div className="text-5xl font-bold text-gray-700">{kanaData ? kanaData.kana : '-'}</div>
                <button
                    onClick={toggleShowAnswer}
                    className="ml-4 p-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition duration-300"
                >
                    {showAnswer ? 'Hide Answer' : 'Show Answer'}
                </button>
                {kanaData && (
                    <button
                        onClick={playAudio}
                        className="ml-2 p-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition duration-300"
                    >
                        🔊
                    </button>
                )}
                {kanaData && (
                    <audio ref={audioRef} src={require(`./audio/${kanaData.romaji}.mp3`)}/>
                )}
            </div>
            {showAnswer && kanaData && (
                <div className="text-lg mb-4 text-gray-700">
                    Answer: {kanaData.romaji}
                </div>
            )}
            <div className="flex space-x-2 mb-4">
                {input.map((value, index) => (
                    <input
                        key={index}
                        type="text"
                        value={value}
                        onChange={(e) => handleInputChange(e, index, input, setInput, inputRefs, inputRef)}
                        onKeyDown={(e) => handleKeyDownInput(e, index, input, inputRefs)}
                        disabled={result !== null || !kanaData}
                        ref={(el) => (inputRefs.current[index] = el)}
                        maxLength={1}
                        className={`w-12 p-2 text-center text-xl border-2 rounded-md transition duration-300 ${
                            result === null ? 'border-gray-300' : result ? 'border-green-500' : 'border-red-500'
                        }`}
                    />
                ))}
                {result === null && (
                    <button
                        onClick={handleSubmit}
                        className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
                    >
                        OK
                    </button>
                )}
            </div>
            {result === false && <div className="text-red-500 mb-2">Incorrect, try again!</div>}
            {result === true && <div className="text-green-500 mb-2">Correct! Press Enter for new Kana</div>}
            {result !== null && (
                <button
                    onClick={handleNewKana}
                    className="border-2 p-2 mb-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
                >
                    New Kana
                </button>
            )}
            <div className="mb-4 w-full">
                <strong className="text-gray-700">Choose Kana Types:</strong>
                <div className="flex flex-wrap mt-2">
                    {['hiragana', 'katakana'].map((type) => (
                        <label key={type} className="flex items-center mr-4 mb-2 text-gray-700">
                            <input
                                type="checkbox"
                                value={type}
                                checked={selectedTypes.includes(type)}
                                onChange={() => handleCheckboxChange(setSelectedTypes, type)}
                                className="mr-2 h-5 w-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                            />
                            {type === 'hiragana' ? '平假名' : '片假名'}
                        </label>
                    ))}
                </div>
            </div>
            <div className="mb-4 w-full">
                <strong className="text-gray-700">Choose Kana Groups:</strong>
                <div className="flex flex-wrap mt-2">
                    {Object.keys(kanaGroups.hiragana).map((group) => (
                        <label key={group} className="flex items-center mr-4 mb-2 text-gray-700">
                            <input
                                type="checkbox"
                                value={group}
                                checked={selectedGroups.includes(group)}
                                onChange={() => handleCheckboxChange(setSelectedGroups, group)}
                                className="mr-2 h-5 w-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                            />
                            {selectedTypes.includes('hiragana') ? kanaGroups.hiragana[group][0].kana : ''}
                            {selectedTypes.includes('katakana') ? kanaGroups.katakana[group][0].kana : ''}
                        </label>
                    ))}
                </div>
            </div>

            <div className="mt-4">
                <strong className="text-gray-700">Statistics:</strong>
                <div className="flex space-x-4 mt-2">
                    <div className="text-green-500">Correct: {correctCount}</div>
                    <div className="text-red-500">Incorrect: {incorrectCount}</div>
                </div>
            </div>

            <div className="mt-4 w-full">
                <strong className="text-gray-700">Incorrect Attempts:</strong>
                {incorrectList.length > 0 ? (
                    <ul className="mt-2">
                        {incorrectList.map((item, index) => (
                            <li key={index} className="flex justify-between mb-2 p-2 bg-gray-100 rounded-md">
                                <span className="text-gray-700">Kana: {item.kana}</span>
                                <span className="text-red-500">Your Input: {item.userInput}</span>
                                <span className="text-green-500">Correct Answer: {item.correctAnswer}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-gray-500 mt-2">No incorrect attempts yet.</div>
                )}
            </div>
        </div>
    );
};

export default KanaChecker;