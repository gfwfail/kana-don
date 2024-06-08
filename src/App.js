import React, { useState, useEffect } from 'react';
import { kanaGroups, getRandomKana } from './kanaUtils';

const KanaChecker = () => {
    const [selectedTypes, setSelectedTypes] = useState(
        JSON.parse(localStorage.getItem('selectedTypes')) || ['hiragana', 'katakana']
    );
    const [selectedGroups, setSelectedGroups] = useState(
        JSON.parse(localStorage.getItem('selectedGroups')) || Object.keys(kanaGroups.hiragana)
    );
    const [kanaData, setKanaData] = useState(null);
    const [input, setInput] = useState('');
    const [isCorrect, setIsCorrect] = useState(null);
    const [showAnswer, setShowAnswer] = useState(false);
    const [correctCount, setCorrectCount] = useState(0);
    const [incorrectCount, setIncorrectCount] = useState(0);
    const [isAnswered, setIsAnswered] = useState(false);

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

    const handleChange = (e) => {
        const cleanedInput = e.target.value.replace(/[^a-zA-Z]/g, '');
        setInput(cleanedInput);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !isAnswered && kanaData) {
            const cleanedInput = input.replace(/[^a-zA-Z]/g, '');
            if (cleanedInput.toLowerCase() === kanaData.romaji) {
                setIsCorrect(true);
                setCorrectCount(prev => prev + 1);
            } else {
                setIsCorrect(false);
                setIncorrectCount(prev => prev + 1);
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
        setInput('');
        setIsCorrect(null);
        setShowAnswer(false);
        setIsAnswered(false);
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
            if (e.code === 'Space' && isCorrect) {
                e.preventDefault();
                handleNewKana();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isCorrect]);

    return (
        <div className="flex flex-col items-center p-4 bg-white shadow-md rounded-md max-w-lg mx-auto mt-10">
            <div className="flex items-center mb-4">
                <div className="text-4xl font-bold">{kanaData ? kanaData.kana : '-'}</div>
                <button
                    onClick={toggleShowAnswer}
                    className="ml-4 p-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                >
                    {showAnswer ? 'Hide Answer' : 'Show Answer'}
                </button>
            </div>
            {showAnswer && kanaData && (
                <div className="text-lg mb-4 text-gray-700">
                    Answer: {kanaData.romaji}
                </div>
            )}
            <input
                type="text"
                value={input}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                disabled={isAnswered || !kanaData}
                className={`border-2 p-2 mb-4 w-full max-w-xs text-center text-xl ${isCorrect === null ? 'border-gray-300' : isCorrect ? 'border-green-500' : 'border-red-500'} rounded-md`}
            />
            {isCorrect === false && <div className="text-red-500 mb-2">Incorrect, try again!</div>}
            {isCorrect === true && <div className="text-green-500 mb-2">Correct! Press Space for new Kana</div>}
            <button
                onClick={handleNewKana}
                className="border-2 p-2 mb-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
                New Kana
            </button>
            <div className="mb-4 w-full">
                <strong>Choose Kana Types:</strong>
                <div className="flex flex-wrap mt-2">
                    {['hiragana', 'katakana'].map(type => (
                        <label key={type} className="flex items-center mr-4 mb-2">
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
                <strong>Choose Kana Groups:</strong>
                <div className="flex flex-wrap mt-2">
                    {Object.keys(kanaGroups.hiragana).map(group => (
                        <label key={group} className="flex items-center mr-4 mb-2">
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
                <strong>Statistics:</strong>
                <div className="flex space-x-4 mt-2">
                    <div className="text-green-500">Correct: {correctCount}</div>
                    <div className="text-red-500">Incorrect: {incorrectCount}</div>
                </div>
            </div>
        </div>
    );
};

export default KanaChecker;