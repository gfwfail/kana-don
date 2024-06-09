import React, { useState, useEffect, useRef } from 'react';
import { kanaGroups, getRandomKana } from './kanaUtils';

const KanaChecker = () => {
    const [selectedTypes, setSelectedTypes] = useState(
        JSON.parse(localStorage.getItem('selectedTypes')) || ['hiragana', 'katakana']
    );
    const [selectedGroups, setSelectedGroups] = useState(
        JSON.parse(localStorage.getItem('selectedGroups')) || Object.keys(kanaGroups.hiragana)
    );
    const [kanaData, setKanaData] = useState(null);
    const [input, setInput] = useState(['', '', '']); // 最多三个字母
    const [isCorrect, setIsCorrect] = useState(null);
    const [showAnswer, setShowAnswer] = useState(false);
    const [correctCount, setCorrectCount] = useState(0);
    const [incorrectCount, setIncorrectCount] = useState(0);
    const [isAnswered, setIsAnswered] = useState(false);
    const inputRefs = useRef([]);

    useEffect(() => {
        if (selectedTypes.length > 0 && selectedGroups.length > 0) {
            setKanaData(getRandomKana(selectedTypes, selectedGroups));
        } else {
            setKanaData(null);
        }
    }, [selectedTypes, selectedGroups]);

    useEffect(() => {
        localStorage.setItem('selectedTypes', JSON.stringify(selectedTypes));
    }, [selectedTypes]);

    useEffect(() => {
        localStorage.setItem('selectedGroups', JSON.stringify(selectedGroups));
    }, [selectedGroups]);

    useEffect(() => {
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, [kanaData]);

    const handleChange = (e, index) => {
        const value = e.target.value.replace(/[^a-zA-Z]/g, '');
        if (value.length <= 1) {
            const newInput = [...input];
            newInput[index] = value;
            setInput(newInput);

            // 移动焦点到下一个输入框
            if (value && index < input.length - 1) {
                inputRefs.current[index + 1].focus();
            }
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && input.join('') && !isAnswered && kanaData) {
            handleSubmit();
        } else if (e.key === 'Enter' && isAnswered) {
            handleNewKana();
        }
    };

    const handleSubmit = () => {
        if (!isAnswered && kanaData) {
            const userInput = input.join('').replace(/[^a-zA-Z]/g, '').toLowerCase();
            if (userInput === kanaData.romaji) {
                setIsCorrect(true);
                setCorrectCount(prev => prev + 1);
            } else {
                setIsCorrect(false);
                setIncorrectCount(prev => prev + 1);
                setShowAnswer(true); // 显示正确答案
            }
            setIsAnswered(true);
        }
    };

    const handleNewKana = () => {
        if (selectedTypes.length > 0 && selectedGroups.length > 0) {
            setKanaData(getRandomKana(selectedTypes, selectedGroups));
        } else {
            setKanaData(null);
        }
        setInput(['', '', '']);
        setIsCorrect(null);
        setShowAnswer(false);
        setIsAnswered(false);
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    };

    const handleGroupChange = (e) => {
        const value = e.target.value;
        setSelectedGroups(prev =>
            prev.includes(value) ? prev.filter(group => group !== value) : [...prev, value]
        );
    };

    const handleTypeChange = (e) => {
        const value = e.target.value;
        setSelectedTypes(prev =>
            prev.includes(value) ? prev.filter(type => type !== value) : [...prev, value]
        );
    };

    const toggleShowAnswer = () => {
        setShowAnswer(prev => !prev);
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Enter' && isAnswered) {
                e.preventDefault();
                handleNewKana();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isAnswered]);

    return (
        <div className="flex flex-col items-center p-6 bg-white shadow-md rounded-lg max-w-lg mx-auto mt-10 border border-gray-300">
            <div className="flex items-center mb-6">
                <div className="text-5xl font-bold text-gray-700">{kanaData ? kanaData.kana : '-'}</div>
                <button
                    onClick={toggleShowAnswer}
                    className="ml-4 p-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition duration-300"
                >
                    {showAnswer ? 'Hide Answer' : 'Show Answer'}
                </button>
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
                        onChange={(e) => handleChange(e, index)}
                        onKeyPress={handleKeyPress}
                        disabled={isAnswered || !kanaData}
                        ref={(el) => (inputRefs.current[index] = el)}
                        maxLength={1}
                        className={`w-12 p-2 text-center text-xl border-2 rounded-md transition duration-300 ${
                            isCorrect === null
                                ? 'border-gray-300'
                                : isCorrect
                                    ? 'border-green-500'
                                    : 'border-red-500'
                        }`}
                    />
                ))}
            </div>
            {!isAnswered && input.join('') && (
                <button
                    onClick={handleSubmit}
                    className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300 mb-4"
                >
                    OK
                </button>
            )}
            {isCorrect === false && <div className="text-red-500 mb-2">Incorrect, try again!</div>}
            {isCorrect === true && <div className="text-green-500 mb-2">Correct! Press Enter for new Kana</div>}
            {isAnswered && (
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
                    {['hiragana', 'katakana'].map(type => (
                        <label key={type} className="flex items-center mr-4 mb-2 text-gray-700">
                            <input
                                type="checkbox"
                                value={type}
                                checked={selectedTypes.includes(type)}
                                onChange={handleTypeChange}
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
                    {Object.keys(kanaGroups.hiragana).map(group => (
                        <label key={group} className="flex items-center mr-4 mb-2 text-gray-700">
                            <input
                                type="checkbox"
                                value={group}
                                checked={selectedGroups.includes(group)}
                                onChange={handleGroupChange}
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
        </div>
    );
};

export default KanaChecker;